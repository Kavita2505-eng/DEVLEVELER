"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/types";
import type { Prisma } from "@prisma/client";
import { enforceRateLimit, RATE_LIMITS, rateLimitKey } from "@/lib/rate-limit";

export interface SettingsData {
  name?: string;
  username?: string;
  bio?: string;
  careerGoals?: string[];
  customSkills?: string[];
  notificationPreferences?: {
    email: boolean;
    reminders: boolean;
    weeklySummary: boolean;
  };
  connectedAccounts?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  isPublic?: boolean;
  role?: string;
  plan?: string;
  isEarlyAdopter?: boolean;
  premiumExpiresAt?: Date | string | null;
  theme?: string;
  themeAccentColor?: string | null;
  themeTextColor?: string | null;
  themeHighlightColor?: string | null;
  avatarSource?: string;
  customAvatar?: string | null;
  googleAvatarUrl?: string | null;
  githubAvatarUrl?: string | null;
}

export async function updateSettingsAction(
  data: SettingsData
): Promise<ApiResponse<boolean>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }
    const userId = session.user.id;

    // Rate limit check
    enforceRateLimit(rateLimitKey(userId, "settings"), RATE_LIMITS.settings);

    // 1. If username is changed, perform uniqueness check
    if (data.username && data.username.trim() !== "") {
      const sanitizedUsername = data.username.trim().toLowerCase();
      
      // Username validation: letters, numbers, hyphens, underscores
      if (!/^[a-zA-Z0-9_-]{3,20}$/.test(sanitizedUsername)) {
        return {
          success: false,
          error: "Username must be 3-20 characters and contain only letters, numbers, underscores, or hyphens.",
        };
      }

      const existing = await prisma.user.findUnique({
        where: { username: sanitizedUsername },
      });

      if (existing && existing.id !== userId) {
        return { success: false, error: "Username is already taken." };
      }
    }

    // 2. Prepare update payload
    const updatePayload: Prisma.UserUpdateInput = {};
    if (data.name !== undefined) updatePayload.name = data.name;
    if (data.bio !== undefined) updatePayload.bio = data.bio;
    if (data.username !== undefined) {
      updatePayload.username = data.username.trim() !== "" ? data.username.trim().toLowerCase() : null;
    }
    if (data.careerGoals !== undefined) {
      updatePayload.careerGoals = data.careerGoals;
    }
    if (data.customSkills !== undefined) {
      updatePayload.customSkills = data.customSkills;
    }
    if (data.notificationPreferences !== undefined) {
      updatePayload.notificationPreferences = data.notificationPreferences as Prisma.InputJsonValue;
    }
    if (data.connectedAccounts !== undefined) {
      updatePayload.connectedAccounts = data.connectedAccounts;
    }
    if (data.isPublic !== undefined) {
      updatePayload.isPublic = data.isPublic;
    }
    if (data.role !== undefined) {
      updatePayload.role = data.role;
    }
    if (data.plan !== undefined) {
      updatePayload.plan = data.plan;
    }
    if (data.theme !== undefined) {
      updatePayload.theme = data.theme;
    }
    if (data.themeAccentColor !== undefined) {
      updatePayload.themeAccentColor = data.themeAccentColor;
    }
    if (data.themeTextColor !== undefined) {
      updatePayload.themeTextColor = data.themeTextColor;
    }
    if (data.themeHighlightColor !== undefined) {
      updatePayload.themeHighlightColor = data.themeHighlightColor;
    }
    if (data.avatarSource !== undefined) {
      updatePayload.avatarSource = data.avatarSource;
    }
    if (data.customAvatar !== undefined) {
      updatePayload.customAvatar = data.customAvatar;
    }

    // 3. Update in database
    await prisma.user.update({
      where: { id: userId },
      data: updatePayload,
    });

    // Log Notification
    await prisma.notification.create({
      data: {
        userId,
        title: "Profile Configurations Updated",
        message: "Your profile information and career goals have been successfully updated.",
        type: "PROFILE_UPDATE",
      },
    });

    return { success: true, data: true };
  } catch (error) {
    console.error("Error in updateSettingsAction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update settings",
    };
  }
}

function parseJsonField<T>(val: unknown, fallback: T): T {
  let parsed: unknown = val;
  if (typeof val === "string") {
    try {
      parsed = JSON.parse(val);
    } catch {
      return fallback;
    }
  }
  
  if (parsed === null || parsed === undefined) {
    return fallback;
  }

  // Check if we are expecting an array
  if (Array.isArray(fallback)) {
    if (Array.isArray(parsed)) {
      return parsed as unknown as T;
    }
    return fallback;
  }

  // Check if we are expecting a plain object
  if (typeof fallback === "object") {
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
      // Check for Prisma DbNull/JsonNull or other non-serializable objects
      const str = String(parsed);
      const parsedObj = parsed as Record<string, unknown>;
      if (str === "DbNull" || str === "JsonNull" || parsedObj.name === "DbNull" || parsedObj.name === "JsonNull") {
        return fallback;
      }
      return parsed as T;
    }
    return fallback;
  }

  return parsed as T;
}

export async function getSettingsAction(): Promise<ApiResponse<SettingsData>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        username: true,
        bio: true,
        careerGoals: true,
        customSkills: true,
        notificationPreferences: true,
        connectedAccounts: true,
        isPublic: true,
        role: true,
        plan: true,
        isEarlyAdopter: true,
        premiumExpiresAt: true,
        theme: true,
        themeAccentColor: true,
        themeTextColor: true,
        themeHighlightColor: true,
        avatarSource: true,
        customAvatar: true,
        googleAvatarUrl: true,
        githubAvatarUrl: true,
        image: true,
      },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    return {
      success: true,
      data: {
        name: user.name ?? undefined,
        username: user.username ?? undefined,
        bio: user.bio ?? undefined,
        careerGoals: parseJsonField(user.careerGoals, [] as string[]),
        customSkills: parseJsonField(user.customSkills, [] as string[]),
        notificationPreferences: parseJsonField(user.notificationPreferences, { email: true, reminders: true, weeklySummary: true }),
        connectedAccounts: parseJsonField(user.connectedAccounts, {} as Record<string, string>),
        isPublic: user.isPublic,
        role: user.role,
        plan: user.plan,
        isEarlyAdopter: user.isEarlyAdopter,
        premiumExpiresAt: user.premiumExpiresAt?.toISOString() ?? null,
        theme: user.theme,
        themeAccentColor: user.themeAccentColor,
        themeTextColor: user.themeTextColor,
        themeHighlightColor: user.themeHighlightColor,
        avatarSource: user.avatarSource,
        customAvatar: user.customAvatar,
        googleAvatarUrl: user.googleAvatarUrl,
        githubAvatarUrl: user.githubAvatarUrl,
      },
    };
  } catch (error) {
    console.error("Error in getSettingsAction:", error);
    return { success: false, error: "Failed to load settings" };
  }
}
