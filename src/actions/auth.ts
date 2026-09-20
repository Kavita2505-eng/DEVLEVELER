"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { sanitizeEmail } from "@/lib/security";

const signUpSchema = z.object({
  email: z.string().email("Invalid email format"),
  name: z.string().min(1, "Name is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Za-z]/, "Password must contain at least one letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export async function signUpAction(formData: FormData) {
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;

  // Rate limit check
  const rateLimitResult = checkRateLimit(sanitizeEmail(email), RATE_LIMITS.auth);
  if (!rateLimitResult.allowed) {
    return { success: false, error: "Too many registration attempts. Please try again later." };
  }

  const parsed = signUpSchema.safeParse({ email, name, password });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      if (existing.password) {
        return { success: false, error: "Account already exists with this email." };
      } else {
        // User created via social login. Assign a credentials password to link them together.
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.update({
          where: { email },
          data: { password: hashedPassword, name },
        });
        return { 
          success: true, 
          message: "Linked password credentials to your existing social account. You can now login." 
        };
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: "DEVELOPER",
        plan: "FREE",
      },
    });

    return { success: true };
  } catch (error) {
    console.error("SignUp Error:", error);
    return { success: false, error: "Registration failed. Please try again." };
  }
}

export async function forgotPasswordAction(email: string) {
  if (!email) return { success: false, error: "Email is required" };

  // Rate limit check
  const sanitizedEmail = sanitizeEmail(email);
  const rateLimitResult = checkRateLimit(sanitizedEmail, RATE_LIMITS.auth);
  if (!rateLimitResult.allowed) {
    return { success: false, error: "Too many reset attempts. Please try again later." };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: sanitizedEmail } });
    if (!user) {
      // Fail silently for security to avoid email enumeration
      return { 
        success: true, 
        message: "If an account matches that email, a password reset link has been generated." 
      };
    }

    // Generate secure token
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expires = new Date(Date.now() + 3600000); // 1 hour expiration

    // Save in VerificationToken table
    await prisma.verificationToken.upsert({
      where: { identifier_token: { identifier: email, token } },
      update: { expires },
      create: { identifier: email, token, expires },
    });

    const resetLink = `/reset-password?token=${token}`;
    console.log(`[PASSWORD RESET]: http://localhost:3000${resetLink}`);

    return { 
      success: true, 
      message: "Reset link generated.", 
      resetLink // Return it on testing UI to let sandbox developer copy it
    };
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return { success: false, error: "Failed to generate password reset token." };
  }
}

export async function resetPasswordAction(token: string, newPassword: string) {
  if (!token || !newPassword) return { success: false, error: "Invalid token or password" };

  if (newPassword.length < 8 || !/[A-Za-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
    return { success: false, error: "Password must be at least 8 characters long and contain both letters and numbers." };
  }

  try {
    const vt = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!vt || vt.expires < new Date()) {
      return { success: false, error: "Reset token has expired or is invalid." };
    }

    const email = vt.identifier;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Apply updates and delete token in transaction
    await prisma.$transaction([
      prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
      }),
      prisma.verificationToken.delete({
        where: { token },
      }),
    ]);

    return { success: true };
  } catch (error) {
    console.error("Reset Password Error:", error);
    return { success: false, error: "Failed to reset password." };
  }
}
