"use client";

import React from "react";
import { cn, getXPProgress, getLevelTitle } from "@/lib/utils";
import { LevelBadge } from "./level-badge";

interface XPProgressProps {
  xp: number;
  className?: string;
}

export const XPProgress = React.memo(function XPProgress({ xp, className }: XPProgressProps) {
  const { currentLevel, currentLevelXP, nextLevelXP, progressPercent } =
    getXPProgress(xp);
  const title = getLevelTitle(currentLevel);
  const xpIntoLevel = xp - currentLevelXP;
  const xpNeeded = nextLevelXP - currentLevelXP;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <LevelBadge level={currentLevel} />
        <span className="text-sm text-[var(--foreground-secondary)]">
          {title}
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--surface)]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] transition-all duration-700 ease-out"
          style={{ width: `${Math.min(progressPercent, 100)}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-[var(--foreground-tertiary)]">
        <span>
          {xpIntoLevel.toLocaleString()} / {xpNeeded.toLocaleString()} XP
        </span>
        <span>Level {currentLevel + 1}</span>
      </div>
    </div>
  );
});
