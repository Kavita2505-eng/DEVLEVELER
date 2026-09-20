"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/types";
import type { Notification } from "@prisma/client";

export async function createNotificationAction(
  userId: string,
  title: string,
  message: string,
  type: "ROADMAP" | "SCORE_IMPROVEMENT" | "ACHIEVEMENT" | "PROFILE_UPDATE"
): Promise<ApiResponse<Notification>> {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
      },
    });
    return { success: true, data: notification };
  } catch (error) {
    console.error("Error in createNotificationAction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create notification",
    };
  }
}

export async function getNotificationsAction(): Promise<ApiResponse<Notification[]>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: notifications };
  } catch (error) {
    console.error("Error in getNotificationsAction:", error);
    return { success: false, error: "Failed to fetch notifications" };
  }
}

export async function markNotificationAsReadAction(
  id: string
): Promise<ApiResponse<boolean>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify ownership before updating
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification || notification.userId !== session.user.id) {
      return { success: false, error: "Notification not found or unauthorized" };
    }

    await prisma.notification.update({
      where: { id },
      data: { read: true },
    });

    return { success: true, data: true };
  } catch (error) {
    console.error("Error in markNotificationAsReadAction:", error);
    return { success: false, error: "Failed to mark notification as read" };
  }
}

export async function markAllNotificationsAsReadAction(): Promise<ApiResponse<boolean>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.notification.updateMany({
      where: {
        userId: session.user.id,
        read: false,
      },
      data: {
        read: true,
      },
    });

    return { success: true, data: true };
  } catch (error) {
    console.error("Error in markAllNotificationsAsReadAction:", error);
    return { success: false, error: "Failed to clear notifications" };
  }
}
