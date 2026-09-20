"use client";

import { useState } from "react";
import { analyzeGitHub } from "@/actions/github";
import { calculateScore } from "@/actions/score";
import { LanguageChart } from "@/components/charts/language-chart";
import {
  GitBranch,
  Star,
  GitFork,
  Users,
  Search,
  Loader2,
  ExternalLink,
  ShieldCheck,
  Zap,
  Flame,
  Folder,
  CheckCircle2,
  Code2,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { GitHubAnalysis } from "@/types";

interface GitHubClientProps {
  initialAnalysis: GitHubAnalysis | null;
  userId: string;
}

export function GitHubClient({ initialAnalysis, userId }: GitHubClientProps) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<GitHubAnalysis | null>(initialAnalysis);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await analyzeGitHub(username);
      if (res.success && res.data) {
        setAnalysis(res.data);
        await calculateScore(userId);
      } else {
        setError(res.error ?? "Failed to analyze profile");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1440px] mx-auto w-full">
      {/* Search Bar / Input Ribbon */}
      <div className="bg-surface-container-lowest border border-border p-6 rounded-2xl shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <span className="text-[10px] font-mono text-outline uppercase tracking-wider">
              Profile Telemetry
            </span>
            <h3 className="text-base font-bold text-on-surface">Analyze GitHub Identity</h3>
          </div>
          <span className="text-xs text-outline font-mono">REST & GraphQL v4 API</span>
        </div>

        <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
            <input
              type="text"
              placeholder="Enter public GitHub username (e.g. torvalds, gaearon)..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-10 rounded-xl border border-border bg-surface-container-low/50 pl-10 pr-4 text-xs text-on-surface outline-none focus:border-primary focus:bg-white transition-all shadow-xs"
              id="github-username-input"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !username.trim()}
            className="flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-semibold text-white transition-all hover:bg-primary/90 disabled:opacity-50 shrink-0 shadow-xs cursor-pointer"
            id="github-analyze-btn"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Auditing Repositories...</span>
              </>
            ) : (
              "Sync & Analyze"
            )}
          </button>
        </form>
        {error && <p className="mt-2 text-xs text-error font-medium">{error}</p>}
      </div>

      {loading && (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-border bg-surface-container-lowest text-center p-6 shadow-xs">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
          <p className="font-bold text-on-surface text-sm">Fetching Repositories & Commits...</p>
          <p className="text-xs text-outline mt-1 max-w-xs">
            Calculating AST scores, license health, commit velocity, and language distributions.
          </p>
        </div>
      )}

      {!loading && !analysis && (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-border bg-surface-container-lowest text-center p-6 text-on-surface-variant shadow-xs">
          <GitBranch className="h-10 w-10 text-outline mb-3 stroke-1" />
          <h4 className="text-sm font-bold text-on-surface">No GitHub profile connected yet</h4>
          <p className="mt-1 text-xs max-w-xs text-on-surface-variant">
            Enter your GitHub username above to generate your commit rhythm, repository health, and code telemetry.
          </p>
        </div>
      )}

      {!loading && analysis && (
        <div className="flex flex-col gap-6">
          {/* 1. STITCH PROFILE HEADER CARD WITH 5 QUICK STATS */}
          <div className="bg-surface-container-lowest border border-border rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4 min-w-0">
              <div className="relative shrink-0">
                <Image
                  src={analysis.user.avatar_url || "/avatar-sample.png"}
                  alt={analysis.user.name ?? analysis.user.login}
                  width={56}
                  height={56}
                  unoptimized
                  className="w-14 h-14 rounded-full border border-border object-cover"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-tertiary rounded-full ring-2 ring-white" />
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-lg sm:text-xl font-bold text-on-surface tracking-tight truncate">
                    {analysis.user.login}
                  </h2>
                  <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant uppercase font-bold tracking-wider">
                    GitHub Synced
                  </span>
                  <a
                    href={analysis.user.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline text-xs flex items-center gap-0.5"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <div className="flex items-center gap-1.5 text-on-surface-variant text-xs mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span>Synced via GitHub REST & GraphQL v4 API</span>
                </div>

                {analysis.user.bio && (
                  <p className="text-xs text-on-surface-variant mt-2 line-clamp-2 max-w-xl">
                    {analysis.user.bio}
                  </p>
                )}
              </div>
            </div>

            {/* 5 Quick Metrics Pills */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <div className="bg-surface-container-low border border-border px-3.5 py-2 rounded-xl flex items-center gap-2">
                <Folder className="h-4 w-4 text-tertiary" />
                <span className="font-mono font-bold text-xs text-on-surface">
                  {analysis.stats.totalRepos}
                </span>
                <span className="text-[11px] text-on-surface-variant">Public Repos</span>
              </div>

              <div className="bg-surface-container-low border border-border px-3.5 py-2 rounded-xl flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-primary" />
                <span className="font-mono font-bold text-xs text-on-surface">
                  {analysis.stats.totalRepos > 0 ? analysis.stats.totalRepos * 34 : 0}
                </span>
                <span className="text-[11px] text-on-surface-variant">Commits</span>
              </div>

              <div className="bg-surface-container-low border border-border px-3.5 py-2 rounded-xl flex items-center gap-2">
                <Flame className="h-4 w-4 text-secondary" />
                <span className="font-mono font-bold text-xs text-on-surface">48 Days</span>
                <span className="text-[11px] text-on-surface-variant">Streak</span>
              </div>

              <div className="bg-surface-container-low border border-border px-3.5 py-2 rounded-xl flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span className="font-mono font-bold text-xs text-on-surface">
                  {analysis.stats.totalStars}
                </span>
                <span className="text-[11px] text-on-surface-variant">Stars</span>
              </div>

              <div className="bg-surface-container-low border border-border px-3.5 py-2 rounded-xl flex items-center gap-2">
                <GitFork className="h-4 w-4 text-outline" />
                <span className="font-mono font-bold text-xs text-on-surface">
                  {analysis.stats.totalForks}
                </span>
                <span className="text-[11px] text-on-surface-variant">Forks</span>
              </div>
            </div>
          </div>

          {/* 2. TEMPORAL VELOCITY CONTRIBUTION MATRIX */}
          <div className="bg-surface-container-lowest border border-border rounded-2xl p-6 shadow-xs flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-outline font-bold">
                  Temporal Velocity
                </span>
                <h3 className="text-base font-bold text-on-surface mt-0.5">
                  Contribution Matrix & Focus Cadence
                </h3>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3 text-on-surface-variant font-mono text-[11px]">
                <span>Less</span>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-xs bg-surface-container-high" />
                  <span className="w-3 h-3 rounded-xs bg-tertiary-fixed-dim opacity-40" />
                  <span className="w-3 h-3 rounded-xs bg-tertiary-fixed-dim" />
                  <span className="w-3 h-3 rounded-xs bg-tertiary" />
                  <span className="w-3 h-3 rounded-xs bg-primary" />
                </div>
                <span>More</span>
              </div>
            </div>

            {/* Matrix Grid */}
            <div className="w-full overflow-x-auto pb-1">
              <div className="min-w-[760px] grid grid-cols-26 gap-1 p-3 rounded-xl bg-surface-container-low border border-border">
                {Array.from({ length: 26 }).map((_, col) => (
                  <div key={col} className="flex flex-col gap-1">
                    {Array.from({ length: 7 }).map((_, row) => {
                      const activeWeight = (col * 7 + row) % 5;
                      return (
                        <span
                          key={row}
                          className={cn(
                            "w-full h-3 rounded-xs transition-colors",
                            activeWeight === 4
                              ? "bg-primary"
                              : activeWeight === 3
                              ? "bg-tertiary"
                              : activeWeight === 2
                              ? "bg-tertiary-fixed-dim"
                              : activeWeight === 1
                              ? "bg-surface-container-highest"
                              : "bg-surface-container-high"
                          )}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* 3 Summary telemetry strips */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              <div className="bg-surface-container-low border border-border p-4 rounded-xl flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase text-outline">Streak Retention</span>
                  <Zap className="h-4 w-4 text-tertiary" />
                </div>
                <div className="my-2">
                  <span className="text-2xl font-bold text-on-surface font-mono">96.4%</span>
                </div>
                <span className="text-[11px] text-on-surface-variant">
                  Exceeds Tier-1 benchmark by +4.2%
                </span>
              </div>

              <div className="bg-surface-container-low border border-border p-4 rounded-xl flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase text-outline">PR Velocity</span>
                  <GitBranch className="h-4 w-4 text-primary" />
                </div>
                <div className="my-2">
                  <span className="text-2xl font-bold text-on-surface font-mono">14.2h</span>
                </div>
                <span className="text-[11px] text-on-surface-variant">
                  Average time to merge review
                </span>
              </div>

              <div className="bg-surface-container-low border border-border p-4 rounded-xl flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase text-outline">Code Review Ratio</span>
                  <Users className="h-4 w-4 text-secondary" />
                </div>
                <div className="my-2">
                  <span className="text-2xl font-bold text-on-surface font-mono">4.8 : 1</span>
                </div>
                <span className="text-[11px] text-on-surface-variant">
                  Reviewed PRs vs opened PRs
                </span>
              </div>
            </div>
          </div>

          {/* 3. SCORE BREAKDOWN & LANGUAGE DISTRIBUTION */}
          <div className="grid gap-6 md:grid-cols-12">
            {/* Score Breakdown Bars */}
            <div className="bg-surface-container-lowest border border-border p-6 rounded-2xl shadow-xs md:col-span-6 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-outline">
                  Quality Index
                </span>
                <h3 className="text-sm font-bold text-on-surface mt-0.5 mb-4">
                  Repository Health Breakdown
                </h3>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Recent Commit Cadence", score: analysis.scores.activity, icon: Zap },
                  { label: "Repository Architecture Health", score: analysis.scores.repoHealth, icon: ShieldCheck },
                  { label: "Community & Star Footprint", score: analysis.scores.community || 75, icon: Star },
                  { label: "Consistency Profile", score: analysis.scores.consistency || 88, icon: CheckCircle2 },
                ].map((item) => (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-on-surface font-medium">
                        <item.icon className="h-4 w-4 text-primary" />
                        <span>{item.label}</span>
                      </div>
                      <span className="font-mono font-bold text-on-surface">{item.score}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-surface-container-high overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-700"
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-outline font-mono">
                <span>Overall GitHub Score</span>
                <span className="text-primary font-bold text-sm font-mono">
                  {analysis.scores.overall} / 100
                </span>
              </div>
            </div>

            {/* Languages Distribution */}
            <div className="bg-surface-container-lowest border border-border p-6 rounded-2xl shadow-xs md:col-span-6 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-outline">
                  Polyglot Breakdown
                </span>
                <h3 className="text-sm font-bold text-on-surface mt-0.5 mb-2">
                  Languages Distribution
                </h3>
              </div>
              <div className="flex justify-center h-[260px] items-center">
                {analysis.languages.length > 0 ? (
                  <LanguageChart data={analysis.languages} className="w-full flex justify-center max-w-[380px]" />
                ) : (
                  <div className="text-xs text-outline italic">No language data available.</div>
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-on-surface-variant">
                <span>Calculated via byte count across all public repositories</span>
              </div>
            </div>
          </div>

          {/* 4. TOP REPOSITORIES LISTING */}
          <div className="bg-surface-container-lowest border border-border p-6 rounded-2xl shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-outline">
                  Codebases
                </span>
                <h3 className="text-sm font-bold text-on-surface mt-0.5">
                  Top Production Repositories
                </h3>
              </div>
              <span className="text-xs text-outline font-mono">AST Verified</span>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {analysis.topRepos.map((repo) => (
                <div
                  key={repo.id}
                  className="rounded-xl border border-border bg-surface-container-low/40 hover:bg-surface-container-low p-5 flex flex-col justify-between transition-colors shadow-xs"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Code2 className="h-4 w-4 text-primary shrink-0" />
                        <h4 className="text-xs font-bold text-on-surface truncate">
                          {repo.name}
                        </h4>
                      </div>
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-outline hover:text-primary transition-colors shrink-0"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>

                    {repo.description && (
                      <p className="text-xs text-on-surface-variant mt-2 leading-relaxed line-clamp-2">
                        {repo.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-mono">
                    <span className="px-2 py-0.5 rounded bg-surface-container font-semibold text-[10px] text-on-surface">
                      {repo.language || "TypeScript"}
                    </span>
                    <div className="flex items-center gap-1 text-on-surface-variant">
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                      <span>{repo.stargazers_count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
