"use client";

import { useState } from "react";
import { analyzePortfolioAction } from "@/actions/portfolio";
import { ProgressRing } from "@/components/charts/progress-ring";
import {
  Globe,
  Loader2,
  Cpu,
  Smartphone,
  Accessibility,
  Palette,
  Sparkles,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PortfolioAnalysisData } from "@/types";

interface PortfolioClientProps {
  initialAnalysis: PortfolioAnalysisData | null;
}

export function PortfolioClient({ initialAnalysis }: PortfolioClientProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<PortfolioAnalysisData | null>(initialAnalysis);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await analyzePortfolioAction(url);
      if (res.success && res.data) {
        setAnalysis(res.data);
      } else {
        setError(res.error ?? "Failed to analyze website");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate overall portfolio score (average of all 5 scores)
  const getOverallScore = (): number => {
    if (!analysis) return 0;
    const sum =
      analysis.performanceScore +
      analysis.seoScore +
      analysis.mobileScore +
      analysis.designScore +
      analysis.accessibilityScore;
    return Math.round(sum / 5);
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="card-base p-6">
        <h3 className="text-sm font-semibold text-[var(--foreground-secondary)] mb-4">
          Analyze Portfolio Website
        </h3>
        <form onSubmit={handleAnalyze} className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Globe className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--foreground-tertiary)]" />
            <input
              type="url"
              placeholder="Enter portfolio URL (e.g. https://myportfolio.dev)..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full h-10 rounded-lg border border-[var(--border)] bg-[var(--surface)] pl-10 pr-4 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-colors"
              id="portfolio-url-input"
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-5 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            id="portfolio-analyze-btn"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Auditing...
              </>
            ) : (
              "Analyze URL"
            )}
          </button>
        </form>
        {error && <p className="mt-3 text-xs text-[var(--error)]">{error}</p>}
      </div>

      {loading && (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] text-sm text-[var(--foreground-secondary)]">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--accent)] mb-3" />
          <p className="font-semibold text-[var(--foreground)]">Running Audits...</p>
          <p className="text-xs text-[var(--foreground-tertiary)] mt-1">
            Scanning lighthouse scores, headers, meta viewport, and design details.
          </p>
        </div>
      )}

      {!loading && !analysis && (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] text-center p-6 text-[var(--foreground-secondary)]">
          <Globe className="h-10 w-10 text-[var(--foreground-muted)] mb-3 stroke-1" />
          <h4 className="text-sm font-semibold text-[var(--foreground)]">No website analyzed yet</h4>
          <p className="mt-1 text-xs max-w-xs">
            Enter your personal portfolio website URL above to inspect web standards.
          </p>
        </div>
      )}

      {!loading && analysis && (
        <div className="space-y-6">
          {/* Export / Actions Row */}
          <div className="flex justify-end gap-3 print:hidden">
            <button
              onClick={() => window.print()}
              className="h-8.5 px-4 rounded-lg bg-[var(--surface)] hover:bg-[var(--border)] border border-[var(--border)] text-xs font-semibold text-[var(--foreground)] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Globe className="h-4 w-4" /> Export Report (PDF)
            </button>
          </div>

          {/* Top Row: Overall Score & Domain Link */}
          <div className="grid gap-6 md:grid-cols-12">
            {/* Domain Info */}
            <div className="card-base p-6 md:col-span-8 flex flex-col justify-between items-start gap-4">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground-tertiary)]">
                  Portfolio Audit
                </span>
                <h3 className="text-lg font-bold text-[var(--foreground)] mt-1">
                  Web Standards Report
                </h3>
                <a
                  href={analysis.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[var(--accent)] hover:underline mt-2"
                >
                  {analysis.url}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--foreground-secondary)] bg-[var(--surface)] border border-[var(--border)] px-3 py-2 rounded-lg">
                <CheckCircle2 className="h-4 w-4 text-[var(--success)] shrink-0" />
                <span>Audits successfully executed. Recommended actions detailed below.</span>
              </div>
            </div>

            {/* Score ring */}
            <div className="card-base p-6 md:col-span-4 flex flex-col items-center justify-center text-center">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground-tertiary)] mb-4 self-start">
                Overall Score
              </h4>
              <ProgressRing score={getOverallScore()} size={135} strokeWidth={9} />
            </div>
          </div>

          {/* Core Categories Score grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { label: "Performance", val: analysis.performanceScore, icon: Cpu },
              { label: "SEO standard", val: analysis.seoScore, icon: Globe },
              { label: "Mobile Ready", val: analysis.mobileScore, icon: Smartphone },
              { label: "Accessibility", val: analysis.accessibilityScore, icon: Accessibility },
              { label: "Design Quality", val: analysis.designScore, icon: Palette },
            ].map((item, idx) => (
              <div key={idx} className="card-base p-4 flex flex-col items-center justify-between text-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-muted)]">
                  <item.icon className="h-4.5 w-4.5 text-[var(--accent)]" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-[var(--foreground-secondary)] block">
                    {item.label}
                  </span>
                  <span className="text-xl font-bold tracking-tight text-[var(--foreground)] mt-1 block">
                    {item.val}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[var(--surface)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--accent)]"
                    style={{ width: `${item.val}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Actionable Suggestions list */}
          <div className="card-base p-6 space-y-5">
            <h3 className="text-sm font-semibold text-[var(--foreground-secondary)]">
              Auditor Recommendations
            </h3>
            <div className="space-y-3">
              {analysis.recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4"
                >
                  <Sparkles className="h-5 w-5 text-[var(--accent)] shrink-0 mt-0.5" />
                  <div>
                    <span
                      className={cn(
                        "inline-block rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider mb-2",
                        rec.impact === "high"
                          ? "bg-[var(--error-muted)] text-[var(--error)]"
                          : rec.impact === "medium"
                          ? "bg-[var(--warning-muted)] text-[var(--warning)]"
                          : "bg-[var(--info-muted)] text-[var(--info)]"
                      )}
                    >
                      {rec.impact} Impact
                    </span>
                    <span className="text-[10px] font-bold text-[var(--foreground-secondary)] uppercase ml-2">
                      Category: {rec.category}
                    </span>
                    <p className="text-xs leading-relaxed text-[var(--foreground-secondary)] mt-1">
                      {rec.message}
                    </p>
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
