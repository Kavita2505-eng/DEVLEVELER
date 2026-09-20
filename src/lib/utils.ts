import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function getScoreColor(score: number): string {
  if (score >= 90) return "text-emerald-400";
  if (score >= 75) return "text-blue-400";
  if (score >= 60) return "text-sky-400";
  if (score >= 40) return "text-amber-400";
  if (score >= 20) return "text-orange-400";
  return "text-red-400";
}

export function getScoreBgColor(score: number): string {
  if (score >= 90) return "bg-emerald-500/10 border-emerald-500/20";
  if (score >= 75) return "bg-blue-500/10 border-blue-500/20";
  if (score >= 60) return "bg-sky-500/10 border-sky-500/20";
  if (score >= 40) return "bg-amber-500/10 border-amber-500/20";
  if (score >= 20) return "bg-orange-500/10 border-orange-500/20";
  return "bg-red-500/10 border-red-500/20";
}

export function getGradeFromScore(score: number): string {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B+";
  if (score >= 60) return "B";
  if (score >= 50) return "C+";
  if (score >= 40) return "C";
  if (score >= 30) return "D";
  return "F";
}

export function getRankFromScore(score: number): string {
  if (score >= 91) return "Master";
  if (score >= 76) return "Architect";
  if (score >= 61) return "Engineer";
  if (score >= 41) return "Builder";
  if (score >= 21) return "Explorer";
  return "Beginner";
}

export function getLevelFromXP(xp: number): number {
  let level = 1;
  let requiredXP = 0;
  while (level <= 50) {
    requiredXP += Math.floor(100 * Math.pow(level, 1.5));
    if (xp < requiredXP) return level;
    level++;
  }
  return 50;
}

export function getXPForLevel(level: number): number {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += Math.floor(100 * Math.pow(i, 1.5));
  }
  return total;
}

export function getXPProgress(xp: number): {
  currentLevel: number;
  currentLevelXP: number;
  nextLevelXP: number;
  progressPercent: number;
} {
  const currentLevel = getLevelFromXP(xp);
  const currentLevelXP = getXPForLevel(currentLevel);
  const nextLevelXP = getXPForLevel(currentLevel + 1);
  const levelRange = nextLevelXP - currentLevelXP;
  const progressInLevel = xp - currentLevelXP;
  const progressPercent = levelRange > 0 ? (progressInLevel / levelRange) * 100 : 100;

  return { currentLevel, currentLevelXP, nextLevelXP, progressPercent };
}

export function getLevelTitle(level: number): string {
  if (level >= 50) return "Master";
  if (level >= 40) return "Architect";
  if (level >= 30) return "Engineer";
  if (level >= 20) return "Builder";
  if (level >= 10) return "Explorer";
  return "Beginner";
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Safely parse a JSON value that may be a string or already parsed.
 * Returns the fallback if parsing fails.
 */
export function safeJsonParse<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
}
