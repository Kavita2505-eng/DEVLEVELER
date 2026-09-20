"use client";

import { useState } from "react";
import { analyzeSkillGaps } from "@/actions/skills";
import { SkillRadar } from "@/components/charts/skill-radar";
import {
  Target,
  Loader2,
  AlertCircle,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { SkillGapAnalysis, RadarDataPoint } from "@/types";
import Link from "next/link";

interface SkillsClientProps {
  initialAnalysis: SkillGapAnalysis | null;
  userId: string;
}

export function SkillsClient({ initialAnalysis, userId }: SkillsClientProps) {
  const [analysis, setAnalysis] = useState<SkillGapAnalysis | null>(initialAnalysis);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await analyzeSkillGaps(userId);
      if (res.success && res.data) {
        setAnalysis(res.data);
      } else {
        setError(res.error ?? "Failed to analyze skill gaps");
      }
    } catch {
      setError("An unexpected error occurred during analysis.");
    } finally {
      setLoading(false);
    }
  };

  const getRadarData = (): RadarDataPoint[] => {
    if (!analysis || !analysis.skillDistribution) return [];
    return analysis.skillDistribution.map((cat) => ({
      subject: cat.category,
      value: cat.coverage,
      fullMark: 100,
    }));
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1440px] mx-auto w-full">
      {/* Top Banner */}
      <div className="bg-surface-container-lowest border border-border p-6 rounded-2xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono text-outline uppercase tracking-wider">
            Diagnostic Tool
          </span>
          <h3 className="text-base font-bold text-on-surface mt-0.5">
            Analyze Market Compatibility
          </h3>
          <p className="text-xs text-on-surface-variant mt-1 max-w-lg leading-relaxed">
            Audit your stack against top engineering requirements in backend, frontend, systems, and cloud infrastructure.
          </p>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-semibold text-white transition-all hover:bg-primary/90 disabled:opacity-50 shrink-0 shadow-xs cursor-pointer"
          id="skills-analyze-btn"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Analyzing Stack...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>{analysis ? "Refresh Analysis" : "Run Skill Audit"}</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 text-xs text-on-error-container bg-error-container border border-error/20 p-4 rounded-xl">
          <AlertCircle className="h-4 w-4 shrink-0 text-error" />
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-border bg-surface-container-lowest text-xs text-on-surface-variant p-6 shadow-xs">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
          <p className="font-bold text-on-surface text-sm">Auditing Stack & Gaps...</p>
          <p className="text-outline mt-1 max-w-xs text-center">
            Parsing AST dependencies and mapping coverage distributions.
          </p>
        </div>
      )}

      {!loading && !analysis && (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-border bg-surface-container-lowest text-center p-6 text-on-surface-variant shadow-xs">
          <Target className="h-10 w-10 text-outline mb-3 stroke-1" />
          <h4 className="text-sm font-bold text-on-surface">No skill analysis recorded</h4>
          <p className="mt-1 text-xs max-w-xs text-on-surface-variant">
            Trigger an automated audit to identify language, framework, and database gaps.
          </p>
        </div>
      )}

      {!loading && analysis && (
        <div className="flex flex-col gap-6">
          {/* Top Row: Radar & Category Distributions */}
          <div className="grid gap-6 md:grid-cols-12">
            {/* Radar Chart */}
            <div className="bg-surface-container-lowest border border-border p-6 rounded-2xl shadow-xs md:col-span-6 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-outline uppercase tracking-wider">
                  Topology
                </span>
                <h3 className="text-sm font-bold text-on-surface mt-0.5 mb-2">
                  Skill Domain Coverage
                </h3>
              </div>
              <div className="flex justify-center h-[300px] items-center">
                <SkillRadar data={getRadarData()} className="w-full flex justify-center max-w-[420px]" />
              </div>
            </div>

            {/* Coverage Bars */}
            <div className="bg-surface-container-lowest border border-border p-6 rounded-2xl shadow-xs md:col-span-6 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-outline uppercase tracking-wider">
                  Competency Vectors
                </span>
                <h3 className="text-sm font-bold text-on-surface mt-0.5 mb-4">
                  Category Coverage Distribution
                </h3>
              </div>
              <div className="flex flex-col gap-4">
                {analysis.skillDistribution.map((cat, i) => (
                  <div key={i} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-on-surface">{cat.category}</span>
                      <span className="font-mono font-bold text-primary">{cat.coverage}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-surface-container-high overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-700"
                        style={{ width: `${cat.coverage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-on-surface-variant">
                <span>Evaluated across repository commits and resume tokens</span>
                <Link href="/dashboard/roadmap" className="text-primary font-semibold hover:underline">
                  View Roadmap →
                </Link>
              </div>
            </div>
          </div>

          {/* Missing Skills Grid */}
          <div className="bg-surface-container-lowest border border-border p-6 rounded-2xl shadow-xs flex flex-col gap-4">
            <div>
              <span className="text-[10px] font-mono text-outline uppercase tracking-wider">
                Deficits
              </span>
              <h3 className="text-sm font-bold text-on-surface mt-0.5">
                Missing High-Demand Skills
              </h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {analysis.missingSkills.map((skill, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-border bg-surface-container-low/50 p-4 flex items-center justify-between hover:bg-surface-container-low transition-colors"
                >
                  <div>
                    <h4 className="text-xs font-bold text-on-surface">{skill.name}</h4>
                    <p className="text-[11px] text-outline font-mono mt-0.5">{skill.category}</p>
                  </div>
                  <span className="rounded-full bg-error-container px-2 py-0.5 font-mono text-[10px] font-bold text-on-error-container uppercase">
                    GAP
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Targeted Recommendations */}
          <div className="bg-surface-container-lowest border border-border p-6 rounded-2xl shadow-xs flex flex-col gap-4">
            <div>
              <span className="text-[10px] font-mono text-outline uppercase tracking-wider">
                Action Items
              </span>
              <h3 className="text-sm font-bold text-on-surface mt-0.5">
                Targeted AI Recommendations
              </h3>
            </div>
            <div className="flex flex-col divide-y divide-border/60">
              {analysis.recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="flex flex-col md:flex-row md:items-start justify-between gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-on-surface">{rec.skill}</h4>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider",
                          rec.priority === "critical"
                            ? "bg-error-container text-on-error-container"
                            : rec.priority === "important"
                            ? "bg-secondary-fixed text-on-secondary-fixed"
                            : "bg-surface-container-high text-on-surface-variant"
                        )}
                      >
                        {rec.priority}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-on-surface-variant">
                      {rec.reason}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5 shrink-0">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-outline font-semibold">
                      Curated Modules
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {rec.resources.map((res, rIdx) => (
                        <div
                          key={rIdx}
                          className="inline-flex items-center gap-1.5 text-xs text-primary bg-surface-container px-2.5 py-1 rounded-lg border border-border font-medium hover:bg-surface-container-high cursor-pointer transition-colors"
                        >
                          <BookOpen className="h-3 w-3" />
                          <span>{res}</span>
                        </div>
                      ))}
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
