"use client";

import React from "react";
import { cn, getScoreColor } from "@/lib/utils";

interface ProgressRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export const ProgressRing = React.memo(function ProgressRing({
  score,
  size = 160,
  strokeWidth = 10,
  className,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  // Map score to stroke color
  function getStrokeColor(s: number): string {
    if (s >= 90) return "#34d399"; // emerald-400
    if (s >= 75) return "#60a5fa"; // blue-400
    if (s >= 60) return "#38bdf8"; // sky-400
    if (s >= 40) return "#fbbf24"; // amber-400
    if (s >= 20) return "#fb923c"; // orange-400
    return "#f87171"; // red-400
  }

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--surface)"
          strokeWidth={strokeWidth}
        />
        {/* Score ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getStrokeColor(score)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          className="score-ring-animated"
          style={{
            ["--circumference" as string]: circumference,
            ["--target-offset" as string]: offset,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={cn(
            "text-3xl font-bold tabular-nums",
            getScoreColor(score)
          )}
        >
          {score}
        </span>
        <span className="text-xs text-[var(--foreground-tertiary)]">/ 100</span>
      </div>
    </div>
  );
});
