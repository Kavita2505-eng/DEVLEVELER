import { cn, getLevelTitle } from "@/lib/utils";

interface LevelBadgeProps {
  level: number;
  className?: string;
}

function getTierColor(level: number): string {
  if (level >= 50) return "bg-amber-500/15 text-amber-400 border-amber-500/30";
  if (level >= 40) return "bg-purple-500/15 text-purple-400 border-purple-500/30";
  if (level >= 30) return "bg-blue-500/15 text-blue-400 border-blue-500/30";
  if (level >= 20) return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
  if (level >= 10) return "bg-sky-500/15 text-sky-400 border-sky-500/30";
  return "bg-zinc-500/15 text-zinc-400 border-zinc-500/30";
}

export function LevelBadge({ level, className }: LevelBadgeProps) {
  const title = getLevelTitle(level);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
        getTierColor(level),
        className
      )}
    >
      <span className="font-mono">Lv.{level}</span>
      <span className="opacity-70">·</span>
      <span>{title}</span>
    </span>
  );
}
