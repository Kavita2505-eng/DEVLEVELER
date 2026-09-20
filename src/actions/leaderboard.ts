"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/types";

export interface LeaderboardEntry {
  userId: string;
  name: string;
  image: string | null;
  username: string | null;
  xp: number;
  level: number;
  overallScore: number;
  rank: string;
  levelTitle: string;
  absoluteRank: number;
}

export interface LeaderboardData {
  entries: LeaderboardEntry[];
  currentUser: {
    absoluteRank: number;
    percentile: number;
    totalUsers: number;
  } | null;
}

export async function getLeaderboardAction(): Promise<ApiResponse<LeaderboardData>> {
  try {
    const session = await auth();
    const currentUserId = session?.user?.id;

    // 1. Fetch all users with score and levels sorted by XP desc
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        username: true,
        xp: true,
        level: true,
        devScore: {
          select: {
            overallScore: true,
            rank: true,
            level: true,
          },
        },
      },
      orderBy: {
        xp: "desc",
      },
    });

    // 2. Format entries and compute ranks
    const totalUsers = users.length;
    const entries: LeaderboardEntry[] = users.map((u, idx) => ({
      userId: u.id,
      name: u.name ?? "Anonymous Developer",
      image: u.image,
      username: u.username,
      xp: u.xp,
      level: u.level,
      overallScore: u.devScore?.overallScore ? Math.round(u.devScore.overallScore) : 0,
      rank: u.devScore?.rank ?? "Unranked",
      levelTitle: u.devScore?.level ?? "Beginner",
      absoluteRank: idx + 1,
    }));

    // 3. Extract current user details
    let currentUserDetails = null;
    if (currentUserId) {
      const currentIdx = entries.findIndex((e) => e.userId === currentUserId);
      if (currentIdx !== -1) {
        const absoluteRank = currentIdx + 1;
        // Percentile formula: ((total - rank) / total) * 100
        const percentile = totalUsers > 1
          ? Math.round(((totalUsers - absoluteRank) / (totalUsers - 1)) * 100)
          : 100;

        currentUserDetails = {
          absoluteRank,
          percentile,
          totalUsers,
        };
      }
    }

    return {
      success: true,
      data: {
        entries,
        currentUser: currentUserDetails,
      },
    };
  } catch (error) {
    console.error("Error in getLeaderboardAction:", error);
    return { success: false, error: "Failed to load leaderboard data" };
  }
}
