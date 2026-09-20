"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/types";

export interface AdminUserListItem {
  id: string;
  name: string | null;
  email: string;
  username: string | null;
  role: string;
  plan: string;
  xp: number;
  level: number;
  createdAt: Date;
  isEarlyAdopter: boolean;
  premiumStartedAt: Date | null;
  premiumExpiresAt: Date | null;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalScans: number;
  monthlyGrowth: number;
  users: AdminUserListItem[];
  totalEarlyAdopters: number;
  claimedSpots: number;
  remainingSpots: number;
}

export async function getAdminStatsAction(): Promise<ApiResponse<AdminStats>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify current user is ADMIN
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!currentUser || currentUser.role !== "ADMIN") {
      return { success: false, error: "Access restricted to administrators." };
    }

    // 1. Gather global platform counts
    const totalUsers = await prisma.user.count();

    // Active users: registered or updated in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeUsers = await prisma.user.count({
      where: {
        updatedAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    // Total Scans: sum of resumes, portfolio analyses, project analyses, roadmap counts, and interview sessions
    const [resumeCount, projectCount, portfolioCount, roadmapCount, interviewCount] = await Promise.all([
      prisma.resume.count(),
      prisma.projectAnalysis.count(),
      prisma.portfolioAnalysis.count(),
      prisma.roadmap.count(),
      prisma.interviewSession.count(),
    ]);

    const totalScans = resumeCount + projectCount + portfolioCount + roadmapCount + interviewCount;

    // Monthly Growth: percentage of users created in last 30 days
    const newUsersLast35Days = await prisma.user.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });
    const monthlyGrowth = totalUsers > 0 ? Math.round((newUsersLast35Days / totalUsers) * 100) : 0;

    // 2. Fetch early adopter stats
    const totalEarlyAdopters = await prisma.user.count({
      where: { isEarlyAdopter: true },
    });
    const claimedSpots = totalEarlyAdopters;
    const remainingSpots = Math.max(0, 5 - totalEarlyAdopters);

    // 3. Fetch all users for user management table
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        role: true,
        plan: true,
        xp: true,
        level: true,
        createdAt: true,
        isEarlyAdopter: true,
        premiumStartedAt: true,
        premiumExpiresAt: true,
      },
    });

    return {
      success: true,
      data: {
        totalUsers,
        activeUsers,
        totalScans,
        monthlyGrowth,
        users,
        totalEarlyAdopters,
        claimedSpots,
        remainingSpots,
      },
    };
  } catch (error) {
    console.error("Error in getAdminStatsAction:", error);
    return { success: false, error: "Failed to load administrator statistics." };
  }
}

export async function updateUserRoleOrPlanAction(
  targetUserId: string,
  role: "DEVELOPER" | "RECRUITER" | "ADMIN",
  plan: "FREE" | "PRO"
): Promise<ApiResponse<boolean>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify current user is ADMIN
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!currentUser || currentUser.role !== "ADMIN") {
      return { success: false, error: "Access restricted to administrators." };
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { premiumStartedAt: true, premiumExpiresAt: true },
    });

    const now = new Date();
    const isPro = plan === "PRO";

    await prisma.user.update({
      where: { id: targetUserId },
      data: {
        role,
        plan,
        premiumStartedAt: isPro ? (targetUser?.premiumStartedAt ?? now) : null,
        premiumExpiresAt: isPro ? (targetUser?.premiumExpiresAt ?? new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000)) : null,
      },
    });

    // Create a notification for the updated user
    await prisma.notification.create({
      data: {
        userId: targetUserId,
        title: "Account Credentials Updated",
        message: `An administrator updated your account to the ${plan} plan and assigned you the ${role} role.`,
        type: "PROFILE_UPDATE",
      },
    });

    return { success: true, data: true };
  } catch (error) {
    console.error("Error in updateUserRoleOrPlanAction:", error);
    return { success: false, error: "Failed to update user configurations." };
  }
}
