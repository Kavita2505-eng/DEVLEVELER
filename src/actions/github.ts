"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { analyzeGitHubProfile } from "@/lib/github";
import { githubUsernameSchema } from "@/lib/validators";
import { calculateLevel, XP_REWARDS } from "@/lib/xp";
import { unlockAchievement } from "@/lib/achievements";
import type { ApiResponse, GitHubAnalysis } from "@/types";
import { calculateScore } from "@/actions/score";
import { enforceRateLimit, RATE_LIMITS, rateLimitKey } from "@/lib/rate-limit";

export async function analyzeGitHub(
  username: string
): Promise<ApiResponse<GitHubAnalysis>> {
  try {
    // 0. Rate limit check
    const session = await auth();
    if (session?.user?.id) {
      enforceRateLimit(
        rateLimitKey(session.user.id, "github"),
        RATE_LIMITS.analysis
      );
    }

    // 1. Validate input
    const parsed = githubUsernameSchema.safeParse(username);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    // 2. Perform analysis via service layer
    const analysis = await analyzeGitHubProfile(parsed.data);

    // 3. Save to database if user is authenticated
    if (session?.user?.id) {
      const userId = session.user.id;

      // Check if profile already existed
      const existingProfile = await prisma.gitHubProfile.findUnique({
        where: { userId },
      });

      // Upsert profile
      await prisma.gitHubProfile.upsert({
        where: { userId },
        update: {
          username: analysis.user.login,
          avatarUrl: analysis.user.avatar_url,
          bio: analysis.user.bio,
          publicRepos: analysis.stats.totalRepos,
          followers: analysis.stats.followers,
          following: analysis.stats.following,
          totalStars: analysis.stats.totalStars,
          totalForks: analysis.stats.totalForks,
          languages: JSON.stringify(analysis.languages),
          topRepos: JSON.stringify(analysis.topRepos),
          activityScore: analysis.scores.activity,
          repoHealth: analysis.scores.repoHealth,
          githubScore: analysis.scores.overall,
          analyzedAt: new Date(),
        },
        create: {
          userId,
          username: analysis.user.login,
          avatarUrl: analysis.user.avatar_url,
          bio: analysis.user.bio,
          publicRepos: analysis.stats.totalRepos,
          followers: analysis.stats.followers,
          following: analysis.stats.following,
          totalStars: analysis.stats.totalStars,
          totalForks: analysis.stats.totalForks,
          languages: JSON.stringify(analysis.languages),
          topRepos: JSON.stringify(analysis.topRepos),
          activityScore: analysis.scores.activity,
          repoHealth: analysis.scores.repoHealth,
          githubScore: analysis.scores.overall,
        },
      });

      // Award XP if this is the first analysis
      if (!existingProfile) {
        const reward = XP_REWARDS.GITHUB_ANALYZED;

        // Fetch current user XP
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { xp: true },
        });

        if (user) {
          const newXP = user.xp + reward.amount;
          const levelInfo = calculateLevel(newXP);

          await prisma.$transaction([
            // Record XP History
            prisma.xPHistory.create({
              data: {
                userId,
                amount: reward.amount,
                reason: reward.reason,
                category: reward.category,
              },
            }),
            // Update User
            prisma.user.update({
              where: { id: userId },
              data: {
                xp: newXP,
                level: levelInfo.level,
              },
            }),
          ]);
        }
      }

      // Check/unlock achievements
      await unlockAchievement(userId, "first_analysis");
      if (analysis.scores.overall >= 75) {
        await unlockAchievement(userId, "github_explorer");
      }

      // Update developer score
      await calculateScore(userId);
    }

    return { success: true, data: analysis };
  } catch (error) {
    console.error("Error in analyzeGitHub:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "GitHub analysis failed",
    };
  }
}
