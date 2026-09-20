"use client";

import { useState } from "react";
import { analyzeProjectAction } from "@/actions/projects";
import { ProgressRing } from "@/components/charts/progress-ring";
import {
  FolderCode,
  Loader2,
  CheckCircle2,
  XCircle,
  Code2,
  Layers,
  Wrench,
  BookOpen,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ImprovementTask {
  week: number;
  title: string;
  description: string;
}

interface ProjectAnalysisData {
  id?: string;
  repoUrl: string;
  overallScore: number;
  architectureScore: number;
  documentationScore: number;
  maintainabilityScore: number;
  deploymentScore: number;

  documentationQuality?: string;
  readmeQuality?: string;
  projectStructure?: string;
  folderOrganization?: string;
  scalability?: string;
  maintainability?: string;
  codeComplexity?: string;
  deploymentStatus?: string;

  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  improvementRoadmap: ImprovementTask[];
  analyzedAt?: Date | string;
}

interface ProjectsClientProps {
  initialAnalyses: ProjectAnalysisData[];
}

export function ProjectsClient({ initialAnalyses }: ProjectsClientProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ProjectAnalysisData | null>(
    initialAnalyses.length > 0 ? initialAnalyses[0] : null
  );
  const [history, setHistory] = useState<ProjectAnalysisData[]>(initialAnalyses);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await analyzeProjectAction(url);
      if (res.success && res.data) {
        const mappedData: ProjectAnalysisData = {
          repoUrl: url,
          overallScore: res.data.overallScore,
          architectureScore: res.data.architectureScore,
          documentationScore: res.data.documentationScore,
          maintainabilityScore: res.data.maintainabilityScore,
          deploymentScore: res.data.deploymentScore,
          documentationQuality: res.data.documentationQuality,
          readmeQuality: res.data.readmeQuality,
          projectStructure: res.data.projectStructure,
          folderOrganization: res.data.folderOrganization,
          scalability: res.data.scalability,
          maintainability: res.data.maintainability,
          codeComplexity: res.data.codeComplexity,
          deploymentStatus: res.data.deploymentStatus,
          strengths: res.data.strengths,
          weaknesses: res.data.weaknesses,
          recommendations: res.data.recommendations,
          improvementRoadmap: res.data.improvementRoadmap,
          analyzedAt: new Date(),
        };
        setAnalysis(mappedData);
        setHistory((prev) => [mappedData, ...prev]);
        setUrl("");
      } else {
        setError(res.error ?? "Failed to audit repository");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-blue-400";
    if (score >= 40) return "text-amber-400";
    return "text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-500/10 border-emerald-500/20";
    if (score >= 60) return "bg-blue-500/10 border-blue-500/20";
    if (score >= 40) return "bg-amber-500/10 border-amber-500/20";
    return "bg-red-500/10 border-red-500/20";
  };

  return (
    <div className="space-y-6">
      {/* URL Submission Header */}
      <div className="card-base p-6">
        <h3 className="text-sm font-semibold text-[var(--foreground-secondary)] mb-4 flex items-center gap-2">
          <FolderCode className="h-4 w-4" /> Audit GitHub Repository
        </h3>
        <form onSubmit={handleAnalyze} className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[var(--foreground-tertiary)]">github.com/</span>
            <input
              type="text"
              placeholder="owner/repository..."
              value={url.replace(/^https?:\/\/github\.com\//, "")}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full h-10 rounded-lg border border-[var(--border)] bg-[var(--surface)] pl-26 pr-4 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-colors"
              required
              disabled={loading}
              id="repo-url-input"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-5 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed shrink-0 font-semibold"
            id="repo-analyze-btn"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Auditing Architecture...
              </>
            ) : (
              "Analyze Repository"
            )}
          </button>
        </form>
        {error && (
          <div className="mt-3 flex items-center gap-2 text-xs text-[var(--error)]">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {loading && (
        <div className="flex h-72 flex-col items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] text-sm text-[var(--foreground-secondary)] p-6">
          <Loader2 className="h-10 w-10 animate-spin text-[var(--accent)] mb-4" />
          <p className="font-bold text-[var(--foreground)]">Running Static & Architectural Audits...</p>
          <p className="text-xs text-[var(--foreground-tertiary)] mt-2 max-w-sm text-center leading-relaxed">
            Crawling folder structures, analyzing dependency configurations, inspecting README setup scripts, and rating scalability patterns.
          </p>
        </div>
      )}

      {!loading && !analysis && (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] text-center p-6 text-[var(--foreground-secondary)]">
          <FolderCode className="h-10 w-10 text-[var(--foreground-muted)] mb-3 stroke-1" />
          <h4 className="text-sm font-semibold text-[var(--foreground)]">No repository audited yet</h4>
          <p className="mt-1 text-xs max-w-xs leading-relaxed">
            Paste a public GitHub repository link above to scan folder designs, scalability benchmarks, and code maintainability.
          </p>
        </div>
      )}

      {!loading && analysis && (
        <div className="flex justify-end gap-3 print:hidden -mb-2">
          <button
            onClick={() => window.print()}
            className="h-8.5 px-4 rounded-lg bg-[var(--surface)] hover:bg-[var(--border)] border border-[var(--border)] text-xs font-semibold text-[var(--foreground)] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FolderCode className="h-4 w-4" /> Export Report (PDF)
          </button>
        </div>
      )}

      {!loading && analysis && (
        <div className="grid gap-6 lg:grid-cols-12 items-start">
          {/* Left panel: Scores & findings */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Audited Domain Info */}
            <div className="card-base p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground-tertiary)]">Repository Architecture Audit</span>
                <h2 className="text-lg font-bold text-[var(--foreground)] break-all mt-1">
                  {analysis.repoUrl.replace(/^https?:\/\/(www\.)?github\.com\//, "")}
                </h2>
                <a
                  href={analysis.repoUrl.startsWith("http") ? analysis.repoUrl : `https://${analysis.repoUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[var(--accent)] hover:underline mt-2 font-medium"
                >
                  View on GitHub <ArrowRight className="h-3 w-3" />
                </a>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ProgressRing score={analysis.overallScore} size={110} strokeWidth={8} />
                <span className="text-[10px] font-semibold text-[var(--foreground-secondary)] mt-1">Architecture Rating</span>
              </div>
            </div>

            {/* Visual breakdown grid */}
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="card-base p-4 flex flex-col items-center justify-center text-center space-y-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground-tertiary)]">Modular Architecture</span>
                <ProgressRing score={analysis.architectureScore} size={70} strokeWidth={5} />
              </div>
              <div className="card-base p-4 flex flex-col items-center justify-center text-center space-y-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground-tertiary)]">Documentation</span>
                <ProgressRing score={analysis.documentationScore} size={70} strokeWidth={5} />
              </div>
              <div className="card-base p-4 flex flex-col items-center justify-center text-center space-y-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground-tertiary)]">Maintainability</span>
                <ProgressRing score={analysis.maintainabilityScore} size={70} strokeWidth={5} />
              </div>
              <div className="card-base p-4 flex flex-col items-center justify-center text-center space-y-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground-tertiary)]">CI/CD & Configs</span>
                <ProgressRing score={analysis.deploymentScore} size={70} strokeWidth={5} />
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="card-base p-6 space-y-4">
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Key Strengths
                </h3>
                <ul className="space-y-2.5 text-xs text-[var(--foreground-secondary)]">
                  {analysis.strengths.map((s, idx) => (
                    <li key={idx} className="flex gap-2 leading-relaxed">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card-base p-6 space-y-4">
                <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <XCircle className="h-4 w-4" /> Architectural Gaps
                </h3>
                <ul className="space-y-2.5 text-xs text-[var(--foreground-secondary)]">
                  {analysis.weaknesses.map((w, idx) => (
                    <li key={idx} className="flex gap-2 leading-relaxed">
                      <span className="text-red-400 font-bold">•</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Detailed Audits Breakdown */}
            <div className="card-base p-6 space-y-5">
              <div className="flex items-center gap-2 border-b border-[var(--border)] pb-4">
                <Layers className="h-4.5 w-4.5 text-[var(--foreground-secondary)]" />
                <h3 className="text-sm font-semibold text-[var(--foreground)]">Deep-Dive Findings</h3>
              </div>

              <div className="space-y-4 text-xs">
                {analysis.projectStructure && (
                  <div className="space-y-1">
                    <span className="font-bold text-[var(--foreground-secondary)] flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-blue-400" /> Folder Layout & Architecture
                    </span>
                    <p className="leading-relaxed text-[var(--foreground-secondary)] pl-5">{analysis.projectStructure}</p>
                  </div>
                )}
                {analysis.codeComplexity && (
                  <div className="space-y-1">
                    <span className="font-bold text-[var(--foreground-secondary)] flex items-center gap-1.5">
                      <Code2 className="h-3.5 w-3.5 text-purple-400" /> Complexity & Patterns
                    </span>
                    <p className="leading-relaxed text-[var(--foreground-secondary)] pl-5">{analysis.codeComplexity}</p>
                  </div>
                )}
                {analysis.documentationQuality && (
                  <div className="space-y-1">
                    <span className="font-bold text-[var(--foreground-secondary)] flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5 text-emerald-400" /> Documentation & README Quality
                    </span>
                    <p className="leading-relaxed text-[var(--foreground-secondary)] pl-5">{analysis.documentationQuality}</p>
                  </div>
                )}
                {analysis.deploymentStatus && (
                  <div className="space-y-1">
                    <span className="font-bold text-[var(--foreground-secondary)] flex items-center gap-1.5">
                      <Wrench className="h-3.5 w-3.5 text-amber-400" /> Configuration & Deployment
                    </span>
                    <p className="leading-relaxed text-[var(--foreground-secondary)] pl-5">{analysis.deploymentStatus}</p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right panel: Improvement Roadmap & History */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Improvement Roadmap */}
            <div className="card-base p-5 space-y-5">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground-tertiary)]">Action Plan</span>
                <h3 className="text-sm font-bold text-[var(--foreground)] mt-1">Refactoring Roadmap</h3>
              </div>

              <div className="relative border-l border-[var(--border)] ml-3 pl-5 space-y-5">
                {analysis.improvementRoadmap.map((item, idx) => (
                  <div key={idx} className="relative space-y-1">
                    {/* Circle marker */}
                    <span className="absolute -left-[27px] top-0 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[var(--surface)] border border-[var(--border)]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                    </span>
                    <h4 className="text-xs font-bold text-[var(--foreground)]">Week {item.week}: {item.title}</h4>
                    <p className="text-[11px] leading-relaxed text-[var(--foreground-secondary)]">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Audited History list */}
            {history.length > 1 && (
              <div className="card-base p-5 space-y-3">
                <h3 className="text-xs font-bold text-[var(--foreground)] border-b border-[var(--border)] pb-2.5">Recent Audits</h3>
                <div className="space-y-2">
                  {history.slice(1, 6).map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setAnalysis(item)}
                      className="w-full text-left p-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface)]/80 text-[11px] text-[var(--foreground-secondary)] flex items-center justify-between transition-colors"
                    >
                      <span className="truncate font-medium max-w-[140px]">
                        {item.repoUrl.replace(/^https?:\/\/(www\.)?github\.com\//, "")}
                      </span>
                      <span className={cn("font-bold px-1.5 py-0.5 rounded", getScoreBg(item.overallScore), getScoreColor(item.overallScore))}>
                        {item.overallScore}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
