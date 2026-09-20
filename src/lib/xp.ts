// ============================================================
// DevLeveler — XP & Level System
// ============================================================

import type { LevelInfo } from "@/types";

// ---------------------------------------------------------------------------
// XP Reward Definitions
// ---------------------------------------------------------------------------

export const XP_REWARDS: Record<
  string,
  { amount: number; reason: string; category: string }
> = {
  GITHUB_ANALYZED: {
    amount: 300,
    reason: "Analyzed GitHub profile",
    category: "github",
  },
  RESUME_UPLOADED: {
    amount: 100,
    reason: "Uploaded and analyzed resume",
    category: "resume",
  },
  PORTFOLIO_ANALYZED: {
    amount: 200,
    reason: "Analyzed portfolio website",
    category: "portfolio",
  },
  PROJECT_ANALYZED: {
    amount: 500,
    reason: "Completed project analysis",
    category: "project",
  },
  ROADMAP_GENERATED: {
    amount: 150,
    reason: "Generated learning roadmap",
    category: "roadmap",
  },
  INTERVIEW_COMPLETED: {
    amount: 100,
    reason: "Completed interview practice",
    category: "interview",
  },
} as const;

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MAX_LEVEL = 50;

// ---------------------------------------------------------------------------
// Level title
// ---------------------------------------------------------------------------

function getLevelTitle(level: number): string {
  if (level >= 50) return "Master";
  if (level >= 40) return "Architect";
  if (level >= 30) return "Engineer";
  if (level >= 20) return "Builder";
  if (level >= 10) return "Explorer";
  return "Beginner";
}

// ---------------------------------------------------------------------------
// XP needed for one specific level transition (level → level + 1)
// ---------------------------------------------------------------------------

export function getXPForNextLevel(currentLevel: number): number {
  if (currentLevel >= MAX_LEVEL) return 0;
  return Math.floor(100 * Math.pow(currentLevel, 1.5));
}

// ---------------------------------------------------------------------------
// Calculate level from total XP
// ---------------------------------------------------------------------------

export function calculateLevel(xp: number): LevelInfo {
  let level = 1;
  let accumulatedXP = 0;

  while (level < MAX_LEVEL) {
    const xpForThisLevel = Math.floor(100 * Math.pow(level, 1.5));
    if (accumulatedXP + xpForThisLevel > xp) {
      break;
    }
    accumulatedXP += xpForThisLevel;
    level++;
  }

  const currentLevelStartXP = accumulatedXP;
  const xpNeededForNext = getXPForNextLevel(level);
  const xpIntoCurrentLevel = xp - currentLevelStartXP;

  const progressPercent =
    xpNeededForNext > 0
      ? Math.min(100, Math.round((xpIntoCurrentLevel / xpNeededForNext) * 100))
      : 100;

  return {
    level,
    title: getLevelTitle(level),
    currentXP: xpIntoCurrentLevel,
    nextLevelXP: xpNeededForNext,
    progressPercent,
    totalXP: xp,
  };
}
