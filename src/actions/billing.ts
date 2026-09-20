"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/types";

export async function updateUserPlanAction(
  plan: "FREE" | "PRO"
): Promise<ApiResponse<boolean>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = session.user.id;

    await prisma.user.update({
      where: { id: userId },
      data: { plan },
    });

    // Create a notification for the plan change
    await prisma.notification.create({
      data: {
        userId,
        title: `Plan Updated to ${plan}`,
        message:
          plan === "PRO"
            ? "Thank you for upgrading! You now have unlimited resume, project, portfolio, and interview audits, along with advanced coach recommendations."
            : "Your plan has been changed back to the Free tier. Custom roadmaps are limited and audits are capped.",
        type: "PROFILE_UPDATE",
      },
    });

    return { success: true, data: true };
  } catch (error) {
    console.error("Error in updateUserPlanAction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update user plan",
    };
  }
}

export interface EarlyAdopterStatus {
  claimedSpots: number;
  remainingSpots: number;
  isClosed: boolean;
}

export async function getEarlyAdopterStatusAction(): Promise<ApiResponse<EarlyAdopterStatus>> {
  try {
    const claimedSpots = await prisma.user.count({
      where: { isEarlyAdopter: true },
    });
    const remainingSpots = Math.max(0, 5 - claimedSpots);
    return {
      success: true,
      data: {
        claimedSpots,
        remainingSpots,
        isClosed: claimedSpots >= 5,
      },
    };
  } catch (error) {
    console.error("Error in getEarlyAdopterStatusAction:", error);
    return { success: false, error: "Failed to load early adopter statistics." };
  }
}
