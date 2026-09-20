"use client";

import { useState } from "react";
import { generateRoadmapAction, toggleRoadmapGoalAction } from "@/actions/roadmap";
import {
  Map,
  Loader2,
  CheckCircle2,
  Circle,
  RefreshCw,
  Milestone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { RoadmapData, RoadmapGoal } from "@/types";

interface RoadmapClientProps {
  initialRoadmap: RoadmapData | null;
}

export function RoadmapClient({ initialRoadmap }: RoadmapClientProps) {
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(initialRoadmap);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"weekly" | "monthly">("weekly");

  // Track checked goals locally to update the UI instantly
  const [weeklyGoals, setWeeklyGoals] = useState<RoadmapGoal[]>(
    roadmap?.weeklyGoals ?? []
  );
  const [monthlyGoals, setMonthlyGoals] = useState<RoadmapGoal[]>(
    roadmap?.monthlyGoals ?? []
  );

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await generateRoadmapAction(role);
      if (res.success && res.data) {
        setRoadmap(res.data);
        setWeeklyGoals(res.data.weeklyGoals);
        setMonthlyGoals(res.data.monthlyGoals);
      } else {
        setError(res.error ?? "Failed to generate learning roadmap.");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleGoal = async (
    goalId: string,
    completed: boolean,
    type: "week" | "month"
  ) => {
    if (!roadmap) return;

    // 1. Optimistic update
    if (type === "week") {
      setWeeklyGoals((prev) =>
        prev.map((g) => (g.id === goalId ? { ...g, completed } : g))
      );
    } else {
      setMonthlyGoals((prev) =>
        prev.map((g) => (g.id === goalId ? { ...g, completed } : g))
      );
    }

    // 2. Database update
    try {
      const res = await toggleRoadmapGoalAction(
        roadmap.id,
        goalId,
        completed,
        type
      );
      if (!res.success) {
        // Rollback on failure
        if (type === "week") {
          setWeeklyGoals((prev) =>
            prev.map((g) => (g.id === goalId ? { ...g, completed: !completed } : g))
          );
        } else {
          setMonthlyGoals((prev) =>
            prev.map((g) => (g.id === goalId ? { ...g, completed: !completed } : g))
          );
        }
      }
    } catch {
      // Rollback on failure
      if (type === "week") {
        setWeeklyGoals((prev) =>
          prev.map((g) => (g.id === goalId ? { ...g, completed: !completed } : g))
        );
      } else {
        setMonthlyGoals((prev) =>
          prev.map((g) => (g.id === goalId ? { ...g, completed: !completed } : g))
        );
      }
    }
  };

  // Group weekly goals by week number
  const groupedWeeks: Record<number, RoadmapGoal[]> = {};
  weeklyGoals.forEach((goal) => {
    const w = goal.week ?? 1;
    if (!groupedWeeks[w]) groupedWeeks[w] = [];
    groupedWeeks[w].push(goal);
  });

  // Group monthly goals by month number
  const groupedMonths: Record<number, RoadmapGoal[]> = {};
  monthlyGoals.forEach((goal) => {
    const m = goal.month ?? 1;
    if (!groupedMonths[m]) groupedMonths[m] = [];
    groupedMonths[m].push(goal);
  });

  // Calculate overall progress percentage
  const totalGoals = weeklyGoals.length + monthlyGoals.length;
  const completedGoals =
    weeklyGoals.filter((g) => g.completed).length +
    monthlyGoals.filter((g) => g.completed).length;
  const progressPercent =
    totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Input / Regeneration form if no roadmap or if regenerating */}
      {(!roadmap || loading) && (
        <div className="card-base p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-muted)]">
              <Map className="h-5 w-5 text-[var(--accent)]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                Generate Growth Roadmap
              </h3>
              <p className="text-xs text-[var(--foreground-secondary)] mt-0.5">
                Generate a personalized 12-week learning path focused on your target role.
              </p>
            </div>
          </div>

          {!loading ? (
            <form onSubmit={handleGenerate} className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                placeholder="Enter target career role (e.g. Backend Engineer, Tech Lead)..."
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full h-10 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-colors"
                id="roadmap-role-input"
                required
              />
              <button
                type="submit"
                disabled={!role.trim()}
                className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-5 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                id="roadmap-generate-btn"
              >
                Generate Path
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-sm text-[var(--foreground-secondary)]">
              <Loader2 className="h-8 w-8 animate-spin text-[var(--accent)] mb-3" />
              <p className="font-semibold text-[var(--foreground)]">Curating Your Path...</p>
              <p className="text-xs text-[var(--foreground-tertiary)] mt-1">
                Comparing skills and missing keywords against {role} requirements.
              </p>
            </div>
          )}

          {error && <p className="mt-3 text-xs text-[var(--error)]">{error}</p>}
        </div>
      )}

      {!loading && roadmap && (
        <div className="space-y-6">
          {/* Active Roadmap Header */}
          <div className="card-base p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <span className="rounded-full bg-[var(--success-muted)] border border-[var(--success)]/20 px-2.5 py-0.5 text-[10px] font-semibold text-[var(--success)] uppercase tracking-wider">
                  Active
                </span>
                <span className="text-xs text-[var(--foreground-tertiary)]">
                  Roadmap
                </span>
              </div>
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                {roadmap.title}
              </h3>
              {/* Progress */}
              <div className="flex items-center gap-3 pt-2">
                <div className="h-2 w-32 rounded-full bg-[var(--surface)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--accent)] transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-xs text-[var(--foreground-secondary)] font-medium">
                  {progressPercent}% Complete ({completedGoals}/{totalGoals} goals)
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setRoadmap(null);
                setRole("");
              }}
              className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 text-xs font-medium text-[var(--foreground-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] transition-colors shrink-0"
              id="roadmap-regenerate-btn"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Regenerate
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-[var(--border)] gap-6">
            <button
              onClick={() => setActiveTab("weekly")}
              className={cn(
                "pb-3 text-sm font-medium border-b-2 transition-all",
                activeTab === "weekly"
                  ? "border-[var(--accent)] text-[var(--foreground)]"
                  : "border-transparent text-[var(--foreground-secondary)] hover:text-[var(--foreground)]"
              )}
            >
              12-Week Timeline
            </button>
            <button
              onClick={() => setActiveTab("monthly")}
              className={cn(
                "pb-3 text-sm font-medium border-b-2 transition-all",
                activeTab === "monthly"
                  ? "border-[var(--accent)] text-[var(--foreground)]"
                  : "border-transparent text-[var(--foreground-secondary)] hover:text-[var(--foreground)]"
              )}
            >
              Milestones & Project Ideas
            </button>
          </div>

          {/* Tab 1: 12-Week Timeline */}
          {activeTab === "weekly" && (
            <div className="space-y-8 relative pl-6 before:absolute before:left-2 before:top-4 before:bottom-4 before:w-px before:bg-[var(--border)]">
              {Object.entries(groupedWeeks)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([weekNum, goals]) => (
                  <div key={weekNum} className="relative space-y-4">
                    {/* Weekly node marker */}
                    <div className="absolute -left-[1.8rem] top-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background)]">
                      <Milestone className="h-3 w-3 text-[var(--accent)]" />
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-[var(--foreground)]">
                        Week {weekNum}
                      </h4>
                      <p className="text-xs text-[var(--foreground-tertiary)] mt-0.5">
                        Focus areas and weekly tasks.
                      </p>
                    </div>

                    <div className="grid gap-3 pl-2">
                      {goals.map((goal) => {
                        const isDone = goal.completed;
                        return (
                          <div
                            key={goal.id}
                            onClick={() =>
                              handleToggleGoal(goal.id, !isDone, "week")
                            }
                            className={cn(
                              "flex items-start gap-3 rounded-lg border p-4 bg-[var(--surface)] cursor-pointer transition-all hover:bg-[var(--surface-hover)]",
                              isDone ? "border-[var(--success)]/20 opacity-75" : "border-[var(--border)]"
                            )}
                          >
                            {isDone ? (
                              <CheckCircle2 className="h-5 w-5 text-[var(--success)] shrink-0 mt-0.5" />
                            ) : (
                              <Circle className="h-5 w-5 text-[var(--foreground-muted)] shrink-0 mt-0.5" />
                            )}
                            <div>
                              <h5
                                className={cn(
                                  "text-sm font-semibold",
                                  isDone
                                    ? "text-[var(--foreground-secondary)] line-through"
                                    : "text-[var(--foreground)]"
                                )}
                              >
                                {goal.title}
                              </h5>
                              <p className="text-xs text-[var(--foreground-secondary)] mt-1 leading-relaxed">
                                {goal.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Tab 2: Monthly Goals & Project Ideas */}
          {activeTab === "monthly" && (
            <div className="space-y-6">
              {/* Recommended Tech stack */}
              {roadmap.techStack && roadmap.techStack.length > 0 && (
                <div className="card-base p-6">
                  <h3 className="text-sm font-semibold text-[var(--foreground-secondary)] mb-4">
                    Recommended Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {roadmap.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center rounded-md bg-[var(--surface)] px-2.5 py-1 text-xs font-semibold text-[var(--foreground-secondary)] border border-[var(--border)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Monthly Milestones */}
              <div className="card-base p-6 space-y-5">
                <h3 className="text-sm font-semibold text-[var(--foreground-secondary)]">
                  Monthly Milestones
                </h3>
                <div className="space-y-6">
                  {Object.entries(groupedMonths)
                    .sort(([a], [b]) => Number(a) - Number(b))
                    .map(([monthNum, goals]) => (
                      <div key={monthNum} className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                          Month {monthNum} Milestone
                        </h4>
                        <div className="grid gap-3">
                          {goals.map((goal) => {
                            const isDone = goal.completed;
                            return (
                              <div
                                key={goal.id}
                                onClick={() =>
                                  handleToggleGoal(goal.id, !isDone, "month")
                                }
                                className={cn(
                                  "flex items-start gap-3 rounded-lg border p-4 bg-[var(--surface)] cursor-pointer transition-all hover:bg-[var(--surface-hover)]",
                                  isDone ? "border-[var(--success)]/20 opacity-75" : "border-[var(--border)]"
                                )}
                              >
                                {isDone ? (
                                  <CheckCircle2 className="h-5 w-5 text-[var(--success)] shrink-0 mt-0.5" />
                                ) : (
                                  <Circle className="h-5 w-5 text-[var(--foreground-muted)] shrink-0 mt-0.5" />
                                )}
                                <div>
                                  <h5
                                    className={cn(
                                      "text-sm font-semibold",
                                      isDone
                                        ? "text-[var(--foreground-secondary)] line-through"
                                        : "text-[var(--foreground)]"
                                    )}
                                  >
                                    {goal.title}
                                  </h5>
                                  <p className="text-xs text-[var(--foreground-secondary)] mt-1 leading-relaxed">
                                    {goal.description}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Project Suggestions */}
              {roadmap.projectIdeas && roadmap.projectIdeas.length > 0 && (
                <div className="card-base p-6 space-y-5">
                  <h3 className="text-sm font-semibold text-[var(--foreground-secondary)]">
                    Recommended Projects to Build
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {roadmap.projectIdeas.map((project, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-[var(--foreground)] truncate">
                              {project.name}
                            </h4>
                            <span
                              className={cn(
                                "rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider",
                                project.difficulty === "advanced"
                                  ? "bg-[var(--error-muted)] text-[var(--error)]"
                                  : project.difficulty === "intermediate"
                                  ? "bg-[var(--warning-muted)] text-[var(--warning)]"
                                  : "bg-[var(--success-muted)] text-[var(--success)]"
                              )}
                            >
                              {project.difficulty}
                            </span>
                          </div>
                          <p className="text-xs text-[var(--foreground-secondary)] mt-2 leading-relaxed">
                            {project.description}
                          </p>
                          {/* Tech stack tags */}
                          <div className="mt-3 flex flex-wrap gap-1">
                            {project.technologies.map((t) => (
                              <span
                                key={t}
                                className="text-[10px] bg-[var(--surface-hover)] px-2 py-0.5 rounded border border-[var(--border)] text-[var(--foreground-tertiary)]"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between text-xs text-[var(--foreground-tertiary)] border-t border-[var(--border)] pt-3">
                          <span>Estimated Time</span>
                          <span className="font-semibold text-[var(--foreground)]">
                            {project.estimatedHours} Hours
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
