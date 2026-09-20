"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  Award,
  Zap,
  GitBranch,
  FileText,
  GitFork,
  Users,
  Star,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";

const ICON_MAP = {
  award: Award,
  zap: Zap,
  gitBranch: GitBranch,
  fileText: FileText,
  gitFork: GitFork,
  users: Users,
  star: Star,
};

interface MetricCardProps {
  icon: LucideIcon | string;
  label: string;
  value: string | number;
  change?: {
    value: number;
    label: string;
  };
  className?: string;
  index?: number;
}

export const MetricCard = React.memo(function MetricCard({
  icon,
  label,
  value,
  change,
  className,
  index = 0,
}: MetricCardProps) {
  // Resolve icon component: if string, map it; if LucideIcon component, use it directly
  const IconComponent = typeof icon === "string"
    ? (ICON_MAP[icon as keyof typeof ICON_MAP] || Award)
    : icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={cn("card-base p-6", className)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-muted)]">
            <IconComponent className="h-5 w-5 text-[var(--accent)]" />
          </div>
          <div>
            <p className="text-sm text-[var(--foreground-secondary)]">
              {label}
            </p>
            <p className="text-2xl font-semibold tracking-tight">{value}</p>
          </div>
        </div>
      </div>
      {change && (
        <div className="mt-3 flex items-center gap-1.5">
          <span
            className={cn(
              "text-xs font-medium",
              change.value >= 0 ? "text-[var(--success)]" : "text-[var(--error)]"
            )}
          >
            {change.value >= 0 ? "+" : ""}
            {change.value}%
          </span>
          <span className="text-xs text-[var(--foreground-tertiary)]">
            {change.label}
          </span>
        </div>
      )}
    </motion.div>
  );
});
