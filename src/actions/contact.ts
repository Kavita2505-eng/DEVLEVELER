"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/types";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { sanitizeText, sanitizeEmail } from "@/lib/security";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
  website: z.string().max(0, "Bot detected").optional().or(z.literal("")),
});

export async function submitContactAction(
  formData: FormData
): Promise<ApiResponse<boolean>> {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;
    const website = formData.get("website") as string;

    // Honeypot check — silently succeed for bots
    if (website && website.length > 0) {
      return { success: true };
    }

    // Validate input
    const parsed = contactSchema.safeParse({ name, email, message, website });
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    // Sanitize inputs
    const sanitizedName = sanitizeText(parsed.data.name);
    const sanitizedEmail = sanitizeEmail(parsed.data.email);
    const sanitizedMessage = sanitizeText(parsed.data.message);

    // Rate limit check using centralized rate limiter
    const rateLimitResult = checkRateLimit(sanitizedEmail, RATE_LIMITS.contact);
    if (!rateLimitResult.allowed) {
      return {
        success: false,
        error: "Too many submissions. Please try again later.",
      };
    }

    // Find admin user to notify, or just log
    const adminUser = await prisma.user.findFirst({
      where: { role: "ADMIN" },
      select: { id: true },
    });

    if (adminUser) {
      await prisma.notification.create({
        data: {
          userId: adminUser.id,
          title: "New Contact Form Submission",
          message: `From: ${sanitizedName} (${sanitizedEmail}) — ${sanitizedMessage.slice(0, 200)}`,
          type: "PROFILE_UPDATE",
        },
      });
    }

    console.log(
      `[CONTACT FORM] Name: ${sanitizedName}, Email: ${sanitizedEmail}, Message: ${sanitizedMessage}`
    );

    return { success: true };
  } catch (error) {
    console.error("Error in submitContactAction:", error);
    return {
      success: false,
      error: "Failed to send message. Please try again.",
    };
  }
}
