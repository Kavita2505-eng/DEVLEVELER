import { prisma } from "@/lib/prisma";
import { calculateLevel } from "@/lib/xp";

export interface AchievementDetails {
  type: string;
  title: string;
  description: string;
  icon: string;
}

export const ACHIEVEMENTS: Record<string, AchievementDetails> = {
  first_analysis: {
    type: "first_analysis",
    title: "First Analysis",
    description: "Successfully completed your first GitHub or Resume audit.",
    icon: "Award",
  },
  resume_optimized: {
    type: "resume_optimized",
    title: "Resume Optimized",
    description: "Reached an ATS score of 80 or higher on your resume.",
    icon: "Sparkles",
  },
  github_explorer: {
    type: "github_explorer",
    title: "GitHub Explorer",
    description: "Achieved a GitHub score of 75 or higher.",
    icon: "Code2",
  },
  portfolio_builder: {
    type: "portfolio_builder",
    title: "Portfolio Builder",
    description: "Audited a portfolio website with a score of 75 or higher.",
    icon: "Globe",
  },
  internship_ready: {
    type: "internship_ready",
    title: "Internship Ready",
    description: "Achieved an overall internship readiness score of 80 or higher.",
    icon: "Briefcase",
  },
  career_architect: {
    type: "career_architect",
    title: "Career Architect",
    description: "Generated your first custom career learning roadmap.",
    icon: "Map",
  },
};

/**
 * Attempts to unlock an achievement for a user.
 * Awards +100 XP if unlocked for the first time.
 */
export async function unlockAchievement(
  userId: string,
  type: keyof typeof ACHIEVEMENTS
): Promise<{ success: boolean; unlocked: boolean }> {
  try {
    const detail = ACHIEVEMENTS[type];
    if (!detail) return { success: false, unlocked: false };

    // 1. Check if already unlocked
    const existing = await prisma.userAchievement.findUnique({
      where: {
        userId_achievementType: {
          userId,
          achievementType: type,
        },
      },
    });

    if (existing) {
      return { success: true, unlocked: false };
    }

    // 2. Unlock achievement & award 100 XP
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true },
    });

    if (!user) {
      return { success: false, unlocked: false };
    }

    const xpReward = 100;
    const newXP = user.xp + xpReward;
    const levelInfo = calculateLevel(newXP);

    // Map achievement type to standard XP History category
    let category = "interview";
    if (type === "github_explorer") category = "github";
    if (type === "resume_optimized") category = "resume";
    if (type === "portfolio_builder") category = "portfolio";
    if (type === "career_architect") category = "roadmap";

    await prisma.$transaction([
      prisma.userAchievement.create({
        data: {
          userId,
          achievementType: type,
          title: detail.title,
          description: detail.description,
          icon: detail.icon,
        },
      }),
      prisma.xPHistory.create({
        data: {
          userId,
          amount: xpReward,
          reason: `Unlocked Achievement: ${detail.title}`,
          category,
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: {
          xp: newXP,
          level: levelInfo.level,
        },
      }),
      prisma.notification.create({
        data: {
          userId,
          title: `Achievement Unlocked: ${detail.title}`,
          message: `Congratulations! You unlocked the "${detail.title}" achievement and earned +100 XP.`,
          type: "ACHIEVEMENT",
        },
      }),
    ]);

    return { success: true, unlocked: true };
  } catch (error) {
    console.error("Error unlocking achievement:", error);
    return { success: false, unlocked: false };
  }
}
