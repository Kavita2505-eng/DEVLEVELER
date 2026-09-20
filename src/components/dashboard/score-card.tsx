"use client";

import React from "react";
import { cn, getScoreColor } from "@/lib/utils";
import { ProgressRing } from "@/components/charts/progress-ring";

interface ScoreCardProps {
  score: number;
  label: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export const ScoreCard = React.memo(function ScoreCard({
  score,
  label,
  size = 160,
  strokeWidth = 10,
  className,
}: ScoreCardProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <ProgressRing
        score={score}
        size={size}
        strokeWidth={strokeWidth}
      />
      <p className={cn("text-sm font-medium", getScoreColor(score))}>
        {label}
      </p>
    </div>
  );
});
