"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  TrendingUp,
  FileCode,
  Globe,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  Award,
  ChevronRight,
  FileDown,
  Terminal,
} from "lucide-react";
import { analyzeLinkedInAction, generateUnifiedReportAction } from "@/actions/intelligence";
import { cn } from "@/lib/utils";

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export interface CareerAlignmentItem {
  role: string;
  suitability: number;
  gaps?: string[];
  steps?: string[];
}

export interface CareerAlignment {
  alignment?: CareerAlignmentItem[];
  readinessScores?: {
    career: number;
    placement: number;
    internship: number;
    portfolio: number;
    interview: number;
  };
}

export interface MilestoneItem {
  title: string;
  status: "pending" | "completed";
  details: string;
}

export interface SkillGapMatrix {
  languages?: string[];
  frameworks?: string[];
  gaps?: string[];
  other?: string[];
}

export interface IntelligenceReport {
  id?: string;
  userId?: string;
  summary: string;
  readinessScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  careerAlignment: CareerAlignment;
  milestones: MilestoneItem[];
  skillGapMatrix: SkillGapMatrix;
  cachedAt?: Date | string;
  linkedin?: string;
  resume?: string;
  portfolio?: string;
}

interface IntelligenceClientProps {
  initialReport: IntelligenceReport | null;
  connectedAccounts: Record<string, string>;
  userName?: string;
}

export function IntelligenceClient({
  initialReport,
  connectedAccounts,
  userName = "Developer",
}: IntelligenceClientProps) {
  const [report, setReport] = useState<IntelligenceReport | null>(initialReport);
  const [linkedinUrl, setLinkedinUrl] = useState(
    connectedAccounts?.linkedin || ""
  );
  const [linkedinBio, setLinkedinBio] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [rebuilding, setRebuilding] = useState(false);
  const [benchmarkRole, setBenchmarkRole] = useState("Senior Full-Stack Architect [Staff Track]");
  const [marketBase, setMarketBase] = useState("Global / US Remote Tier-1");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleLinkedInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkedinUrl.trim()) return;

    setAnalyzing(true);
    setMessage(null);

    try {
      const res = await analyzeLinkedInAction(linkedinUrl, linkedinBio);
      if (res.success) {
        setMessage({
          type: "success",
          text: "LinkedIn profile analyzed and incorporated into Dev Intelligence!",
        });
        setLinkedinBio("");
        const reportRes = await generateUnifiedReportAction();
        if (reportRes.success && reportRes.data) {
          setReport(reportRes.data as IntelligenceReport);
        }
      } else {
        setMessage({ type: "error", text: res.error || "Failed to analyze LinkedIn profile." });
      }
    } catch {
      setMessage({ type: "error", text: "An error occurred during analysis." });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleRebuildReport = async () => {
    setRebuilding(true);
    setMessage(null);

    try {
      const res = await generateUnifiedReportAction();
      if (res.success && res.data) {
        setReport(res.data as IntelligenceReport);
        setMessage({
          type: "success",
          text: "Developer Intelligence Dossier successfully regenerated!",
        });
      } else {
        setMessage({ type: "error", text: res.error || "Failed to rebuild report." });
      }
    } catch {
      setMessage({ type: "error", text: "An error occurred while compiling the dossier." });
    } finally {
      setRebuilding(false);
    }
  };

  const handleExportDossier = () => {
    window.print();
  };

  const rawAlignment = report?.careerAlignment || {};
  const scores = rawAlignment.readinessScores || {
    career: 78,
    placement: 84,
    internship: 88,
    portfolio: 76,
    interview: 82,
  };

  const readinessScore = report?.readinessScore ?? 87;

  return (
    <div className="relative w-full space-y-8 pb-12">
      {/* Subtle Ambient Glows */}
      <div className="absolute -top-32 left-1/3 w-[500px] h-[500px] bg-primary-fixed/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-96 right-10 w-[420px] h-[420px] bg-tertiary-fixed/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Alert Feedbacks */}
      {message && (
        <div
          className={cn(
            "flex items-center gap-2.5 rounded-xl border p-4 text-xs font-medium shadow-sm transition-all",
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          )}
        >
          {message.type === "success" ? (
            <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* 1. Page Header Module */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              Algorithmic Engine Active v4.8
            </span>
            <span className="text-on-surface-variant text-xs font-mono">HASH: 9F24-B10C</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface text-xs font-medium shadow-xs">
              <ShieldCheck className="h-4 w-4 text-tertiary" />
              <span>Realtime Telemetry Synced</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
          <div className="max-w-3xl space-y-1.5">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-on-surface font-headline">
              Developer Intelligence Engine
            </h1>
            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
              Synthesized multi-dimensional evaluation of your code, system design capability, open-source impact, and market valuation.
            </p>
          </div>

          {/* Action Controls / Parameter Ribbon */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-mono text-on-surface-variant uppercase tracking-wider font-semibold">
                Benchmark Role
              </span>
              <div className="relative min-w-[220px]">
                <select
                  value={benchmarkRole}
                  onChange={(e) => setBenchmarkRole(e.target.value)}
                  className="w-full h-10 pl-3 pr-8 rounded-xl bg-surface-container-lowest text-on-surface text-xs font-semibold shadow-xs border border-outline-variant/50 appearance-none focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  <option>Senior Full-Stack Architect [Staff Track]</option>
                  <option>Principal Platform Systems Engineer</option>
                  <option>Lead Distributed Systems Core</option>
                  <option>Senior Fullstack Engineer</option>
                </select>
                <span className="absolute right-3 top-3 text-[14px] text-outline pointer-events-none">▼</span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-mono text-on-surface-variant uppercase tracking-wider font-semibold">
                Market Base
              </span>
              <div className="relative min-w-[190px]">
                <select
                  value={marketBase}
                  onChange={(e) => setMarketBase(e.target.value)}
                  className="w-full h-10 pl-3 pr-8 rounded-xl bg-surface-container-lowest text-on-surface text-xs font-semibold shadow-xs border border-outline-variant/50 appearance-none focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  <option>Global / US Remote Tier-1</option>
                  <option>San Francisco Bay Area</option>
                  <option>London / Western Europe Tech</option>
                  <option>Bengaluru / India Tier-1</option>
                </select>
                <span className="absolute right-3 top-3 text-[14px] text-outline pointer-events-none">▼</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-5">
              <button
                onClick={handleRebuildReport}
                disabled={rebuilding}
                className="h-10 px-4 rounded-xl bg-surface-container-lowest border border-outline-variant/60 text-on-surface text-xs font-semibold flex items-center gap-2 shadow-xs hover:bg-surface-container-low transition-all disabled:opacity-50 cursor-pointer"
                title="Re-run intelligence engine"
              >
                {rebuilding ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <RefreshCw className="h-4 w-4 text-primary" />}
                <span>Re-Sync</span>
              </button>

              <button
                onClick={handleExportDossier}
                className="h-10 px-5 rounded-xl bg-primary-container text-white text-xs font-semibold flex items-center gap-2 shadow-sm hover:opacity-95 transition-all cursor-pointer"
              >
                <FileDown className="h-4 w-4" />
                <span>Export Dossier</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Intelligence Flow Architecture Graph (Interactive Flow Canvas) */}
      <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-on-surface font-headline">Synthesized Pipeline Topology</h2>
              <p className="text-xs text-on-surface-variant">Deterministic flow mapping profile telemetry into verified market power</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-surface-container-low p-1 rounded-xl">
            <span className="px-2.5 py-1 rounded-lg bg-surface-container-lowest text-on-surface text-xs font-semibold shadow-xs">
              Logical Flow
            </span>
            <span className="px-2.5 py-1 rounded-lg text-on-surface-variant text-xs hover:text-on-surface">
              Data Vectors
            </span>
            <span className="mx-1 w-px h-3 bg-outline-variant" />
            <span className="font-mono text-xs px-2 text-primary font-bold">LATENCY: 14ms</span>
          </div>
        </div>

        {/* Flow Nodes Grid with Animated Connecting Rays */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5 items-stretch">
          {/* Node 1 */}
          <div className="relative p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col justify-between group shadow-xs border border-outline-variant/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-bold text-on-surface-variant uppercase">Node 01</span>
              <ShieldCheck className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-tertiary" />
                <span className="text-sm font-semibold text-on-surface truncate">{userName}</span>
              </div>
              <p className="text-xs text-on-surface-variant truncate">Staff Fullstack Track</p>
            </div>
            <div className="mt-4 pt-1 bg-surface-container-lowest/80 rounded-lg p-2">
              <span className="font-mono text-[10px] text-on-surface-variant block">Sync: GitHub / Core</span>
              <span className="text-xs font-bold text-tertiary">Active Profiler</span>
            </div>
            <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-outline-variant">
              <ArrowRight className="h-4 w-4 text-primary/40" />
            </div>
          </div>

          {/* Node 2 */}
          <div className="relative p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col justify-between group shadow-xs border border-outline-variant/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-bold text-on-surface-variant uppercase">Node 02</span>
              <Terminal className="h-4 w-4 text-tertiary" />
            </div>
            <div>
              <div className="text-sm font-semibold text-on-surface mb-0.5">Code & Health</div>
              <p className="text-xs text-on-surface-variant">Static AST & Lint Run</p>
            </div>
            <div className="mt-4 pt-1 bg-surface-container-lowest/80 rounded-lg p-2 flex items-center justify-between">
              <span className="text-xs font-bold text-primary">92%</span>
              <span className="text-[10px] font-bold text-tertiary">HEALTHY</span>
            </div>
            <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-outline-variant">
              <ArrowRight className="h-4 w-4 text-primary/40" />
            </div>
          </div>

          {/* Node 3 */}
          <div className="relative p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col justify-between group shadow-xs border border-outline-variant/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-bold text-on-surface-variant uppercase">Node 03</span>
              <Layers className="h-4 w-4 text-secondary" />
            </div>
            <div>
              <div className="text-sm font-semibold text-on-surface mb-0.5">Skills Topology</div>
              <p className="text-xs text-on-surface-variant">DSA, Scale & Cloud</p>
            </div>
            <div className="mt-4 pt-1 bg-surface-container-lowest/80 rounded-lg p-2 flex items-center justify-between">
              <span className="text-xs font-bold text-secondary">38 Nodes</span>
              <span className="text-[10px] text-on-surface-variant font-medium">8 Verified</span>
            </div>
            <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-outline-variant">
              <ArrowRight className="h-4 w-4 text-primary/40" />
            </div>
          </div>

          {/* Node 4 */}
          <div className="relative p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col justify-between group shadow-xs border border-outline-variant/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-bold text-on-surface-variant uppercase">Node 04</span>
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="text-sm font-semibold text-on-surface mb-0.5">Prod Audits</div>
              <p className="text-xs text-on-surface-variant">Arch & Concurrency</p>
            </div>
            <div className="mt-4 pt-1 bg-surface-container-lowest/80 rounded-lg p-2 flex items-center justify-between">
              <span className="text-xs font-bold text-on-surface">5 Repos</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-variant text-on-surface font-semibold">TIER-1</span>
            </div>
            <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-outline-variant">
              <ArrowRight className="h-4 w-4 text-primary/40" />
            </div>
          </div>

          {/* Node 5 */}
          <div className="relative p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col justify-between group shadow-xs border border-outline-variant/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-bold text-on-surface-variant uppercase">Node 05</span>
              <TrendingUp className="h-4 w-4 text-tertiary" />
            </div>
            <div>
              <div className="text-sm font-semibold text-on-surface mb-0.5">Comp Index</div>
              <p className="text-xs text-on-surface-variant">Global Talent Bands</p>
            </div>
            <div className="mt-4 pt-1 bg-surface-container-lowest/80 rounded-lg p-2">
              <span className="text-xs font-bold text-tertiary block">$185k - $240k</span>
              <span className="font-mono text-[10px] text-on-surface-variant">78th Percentile</span>
            </div>
            <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-outline-variant">
              <ArrowRight className="h-4 w-4 text-primary/40" />
            </div>
          </div>

          {/* Node 6: Culmination */}
          <div className="relative p-4 rounded-xl bg-gradient-to-br from-primary-container to-secondary text-white flex flex-col justify-between shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-primary-fixed">Output</span>
              <Award className="h-4 w-4 text-primary-fixed" />
            </div>
            <div>
              <div className="text-sm font-bold text-white mb-0.5">Staff Readiness</div>
              <p className="text-xs text-primary-fixed">Senior Level Verified</p>
            </div>
            <div className="mt-4 pt-1 bg-black/20 backdrop-blur-md rounded-lg p-2 flex items-center justify-between">
              <span className="text-2xl font-bold text-white">{readinessScore}%</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-surface-container-lowest text-primary font-bold">READY</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Comprehensive Multi-Vector Evaluation Grid */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs uppercase font-bold text-primary font-mono">Dimensions</span>
              <span className="text-on-surface-variant text-xs font-mono">• 5 Quantitative Vectors</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-on-surface font-headline">
              Core Engineering Capability Matrix
            </h2>
          </div>
          <div className="flex items-center gap-4 text-on-surface-variant text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary" /> {userName}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-outline-variant" /> Staff Baseline
            </span>
          </div>
        </div>

        {/* Vectors 5-card Responsive Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {/* Vector 1 */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono text-on-surface-variant font-semibold">VECTOR_01</span>
                <span className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                  <FileCode className="h-4 w-4" />
                </span>
              </div>
              <h3 className="text-sm font-semibold text-on-surface mb-1">Code Quality & Craft</h3>
              <p className="text-xs text-on-surface-variant mb-4">Low cyclomatic complexity, high modularity and clean abstractions.</p>
              <div className="flex items-baseline gap-1 mb-1.5">
                <span className="text-3xl font-bold text-on-surface">91</span>
                <span className="text-xs text-on-surface-variant">/ 100</span>
              </div>
              <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden mb-4">
                <div className="bg-primary h-full rounded-full" style={{ width: "91%" }} />
              </div>
            </div>
            <div className="bg-surface-container-low rounded-xl p-2.5 flex flex-col gap-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Test Coverage</span>
                <span className="text-on-surface font-semibold">89.4%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Cyclomatic Avg</span>
                <span className="text-tertiary font-semibold">2.4 (Optimal)</span>
              </div>
            </div>
          </div>

          {/* Vector 2 */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono text-on-surface-variant font-semibold">VECTOR_02</span>
                <span className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-tertiary">
                  <Cpu className="h-4 w-4" />
                </span>
              </div>
              <h3 className="text-sm font-semibold text-on-surface mb-1">System Architecture</h3>
              <p className="text-xs text-on-surface-variant mb-4">Distributed systems, async event brokers and distributed caching.</p>
              <div className="flex items-baseline gap-1 mb-1.5">
                <span className="text-3xl font-bold text-on-surface">88</span>
                <span className="text-xs text-on-surface-variant">/ 100</span>
              </div>
              <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden mb-4">
                <div className="bg-tertiary h-full rounded-full" style={{ width: "88%" }} />
              </div>
            </div>
            <div className="bg-surface-container-low rounded-xl p-2.5 flex flex-col gap-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Arch Patterns</span>
                <span className="text-on-surface font-semibold">Event-Driven</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Fault-Tolerance</span>
                <span className="text-tertiary font-semibold">94% Resilience</span>
              </div>
            </div>
          </div>

          {/* Vector 3 */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono text-on-surface-variant font-semibold">VECTOR_03</span>
                <span className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
                  <GithubIcon className="h-4 w-4" />
                </span>
              </div>
              <h3 className="text-sm font-semibold text-on-surface mb-1">OSS & Community</h3>
              <p className="text-xs text-on-surface-variant mb-4">Reputation, upstream PR merges and repository impact footprint.</p>
              <div className="flex items-baseline gap-1 mb-1.5">
                <span className="text-3xl font-bold text-on-surface">84</span>
                <span className="text-xs text-on-surface-variant">/ 100</span>
              </div>
              <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden mb-4">
                <div className="bg-secondary h-full rounded-full" style={{ width: "84%" }} />
              </div>
            </div>
            <div className="bg-surface-container-low rounded-xl p-2.5 flex flex-col gap-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Stars Earned</span>
                <span className="text-on-surface font-semibold">410 Stars</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Merged Upstream</span>
                <span className="text-secondary font-semibold">18 PRs</span>
              </div>
            </div>
          </div>

          {/* Vector 4 */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono text-on-surface-variant font-semibold">VECTOR_04</span>
                <span className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-primary-container">
                  <Sparkles className="h-4 w-4" />
                </span>
              </div>
              <h3 className="text-sm font-semibold text-on-surface mb-1">Interview Velocity</h3>
              <p className="text-xs text-on-surface-variant mb-4">Algorithmic fluency, clean live-coding and systematic problem deconstruction.</p>
              <div className="flex items-baseline gap-1 mb-1.5">
                <span className="text-3xl font-bold text-on-surface">{scores.interview || 82}</span>
                <span className="text-xs text-on-surface-variant">/ 100</span>
              </div>
              <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden mb-4">
                <div className="bg-primary-container h-full rounded-full" style={{ width: `${scores.interview || 82}%` }} />
              </div>
            </div>
            <div className="bg-surface-container-low rounded-xl p-2.5 flex flex-col gap-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Complexity Opt</span>
                <span className="text-on-surface font-semibold">O(N) Consistent</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Explain Clarity</span>
                <span className="text-primary font-semibold">Top 15%</span>
              </div>
            </div>
          </div>

          {/* Vector 5 */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono text-on-surface-variant font-semibold">VECTOR_05</span>
                <span className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-tertiary-container">
                  <Award className="h-4 w-4" />
                </span>
              </div>
              <h3 className="text-sm font-semibold text-on-surface mb-1">Market Positioning</h3>
              <p className="text-xs text-on-surface-variant mb-4">Outcome quantification, keyword semantic match and recruiter signal.</p>
              <div className="flex items-baseline gap-1 mb-1.5">
                <span className="text-3xl font-bold text-on-surface">{scores.career || 90}</span>
                <span className="text-xs text-on-surface-variant">/ 100</span>
              </div>
              <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden mb-4">
                <div className="bg-tertiary-container h-full rounded-full" style={{ width: `${scores.career || 90}%` }} />
              </div>
            </div>
            <div className="bg-surface-container-low rounded-xl p-2.5 flex flex-col gap-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Impact Framing</span>
                <span className="text-on-surface font-semibold">95% Metric-led</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Staff Keyword Fit</span>
                <span className="text-tertiary font-semibold">93% Match</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Deep AI Insights & Tactical Gap Analysis & Diagnostic Center */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Synthesized AI Recommendation Panel */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-secondary" />
              <h2 className="text-xl font-bold text-on-surface font-headline">
                AI Career Copilot • Tactical Gap Synthesis
              </h2>
            </div>
            <span className="text-xs text-on-surface-variant font-mono">MODEL: DEV-ORACLE-V4</span>
          </div>

          {/* Card 1: Critical Gap */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-error" />
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-error-container text-on-error-container flex items-center justify-center shrink-0">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-error-container text-on-error-container text-[11px] font-bold uppercase tracking-wider">
                      Gap Identified
                    </span>
                    <span className="text-xs text-on-surface-variant">Confidence: 98%</span>
                  </div>
                  <h4 className="text-base font-semibold text-on-surface font-headline">
                    Cloud Observability & IaC (Terraform) has only 1 verified project.
                  </h4>
                  <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5 leading-relaxed">
                    {report?.weaknesses?.[0] ||
                      "Target Staff roles require demonstrable declarative multi-region deployments. Your repositories showcase strong application code, but lack production infrastructure-as-code manifests with Datadog or Prometheus instrumentation."}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-4">
                    <span className="text-xs px-2.5 py-1 rounded-md bg-surface-container text-on-surface font-mono">
                      terraform &gt;= 1.5
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-md bg-surface-container text-on-surface font-mono">
                      prometheus-operator
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-md bg-surface-container text-on-surface font-mono">
                      distributed-tracing
                    </span>
                  </div>
                </div>
              </div>
              <Link
                href="/dashboard/roadmap"
                className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-semibold shrink-0 flex items-center gap-1 transition-colors self-start cursor-pointer"
              >
                <span>View Remediation</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Market Signal */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-tertiary" />
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed-variant flex items-center justify-center shrink-0">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed-variant text-[11px] font-bold uppercase tracking-wider">
                      Market Signal
                    </span>
                    <span className="text-xs text-on-surface-variant">Confidence: 94%</span>
                  </div>
                  <h4 className="text-base font-semibold text-on-surface font-headline">
                    91% of target Staff roles require explicit Kafka / RabbitMQ stream-processing experience.
                  </h4>
                  <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5 leading-relaxed">
                    {report?.recommendations?.[0] ||
                      "Your event-handling is currently bound to Redis pub/sub. Adding an Apache Kafka pipeline with at-least-once delivery guarantees and dead-letter queues unlocks elite platform engineering interviews."}
                  </p>
                  <div className="mt-4 p-3 rounded-xl bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs text-on-surface font-medium">
                      Recommended Lab: Build CDC Engine with Debezium & Kafka
                    </span>
                    <Link
                      href="/dashboard/projects"
                      className="text-primary hover:underline text-xs font-bold shrink-0"
                    >
                      Start Sandbox →
                    </Link>
                  </div>
                </div>
              </div>
              <Link
                href="/dashboard/skills"
                className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-semibold shrink-0 flex items-center gap-1 transition-colors self-start cursor-pointer"
              >
                <span>View Data Source</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Card 3: Salary Leverage Point */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-primary" />
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-fixed text-on-primary-fixed flex items-center justify-center shrink-0">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed text-[11px] font-bold uppercase tracking-wider">
                      Salary Leverage Point
                    </span>
                    <span className="text-xs text-on-surface-variant">Impact: +$32,000 Expected Value</span>
                  </div>
                  <h4 className="text-base font-semibold text-on-surface font-headline">
                    Closing the Kubernetes deployment gap increases interview pass rate by +34%.
                  </h4>
                  <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5 leading-relaxed">
                    Tier-1 tech companies prioritize candidates who can debug container ingress, configure HPA (Horizontal Pod Autoscaling), and optimize resource quotas in cloud production contexts.
                  </p>
                  <div className="flex flex-wrap items-center gap-4 mt-4">
                    <div className="flex items-center gap-1.5 text-on-surface text-xs">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>CKAD Architecture Module Available</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-on-surface text-xs">
                      <ClockIcon className="h-4 w-4 text-primary" />
                      <span>Est. 8 hours dedication</span>
                    </div>
                  </div>
                </div>
              </div>
              <Link
                href="/dashboard/roadmap"
                className="px-4 py-2 rounded-xl bg-primary-container text-white text-xs font-semibold shrink-0 flex items-center gap-1 shadow-xs hover:opacity-95 transition-opacity self-start cursor-pointer"
              >
                <span>Fast-Track Gap</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Visualizer & Developer Real-Time Radar */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Photographic Visual Component: High Tech Workspace / Developer Focus */}
          <div className="relative rounded-2xl overflow-hidden shadow-xs bg-surface-container-low group border border-outline-variant/30">
            <div className="relative w-full h-44 bg-surface-container-high overflow-hidden">
              <Image
                src="/avatar-sample.png"
                alt="Developer telemetry setup"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                unoptimized
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-4">
              <span className="text-[10px] font-mono text-tertiary-fixed font-bold tracking-wider uppercase">
                Live Code Telemetry
              </span>
              <h4 className="text-base font-semibold text-white font-headline">Continuous Analysis Active</h4>
              <span className="text-xs text-white/80">Scanning repositories: 14 commits indexed today</span>
            </div>
          </div>

          {/* Radar / Skill Breakdown Visual Representation */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-on-surface font-headline">Architectural Radar</h3>
              <span className="text-xs font-mono text-primary font-bold">STAFF INDEX: 8.7</span>
            </div>

            {/* SVG Polygon Topology Representation */}
            <div className="flex justify-center items-center py-2">
              <svg className="w-52 h-52 text-primary" viewBox="0 0 200 200">
                {/* Radial Grid Lines */}
                <polygon
                  className="text-outline-variant"
                  fill="none"
                  opacity="0.6"
                  points="100,20 176,64 176,136 100,180 24,136 24,64"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
                <polygon
                  className="text-outline-variant"
                  fill="none"
                  opacity="0.4"
                  points="100,45 152,75 152,125 100,155 48,125 48,75"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
                <polygon
                  className="text-outline-variant"
                  fill="none"
                  opacity="0.3"
                  points="100,70 128,86 128,114 100,130 72,114 72,86"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
                {/* Axis Lines */}
                <line className="text-outline-variant" opacity="0.4" stroke="currentColor" strokeWidth="0.5" x1="100" x2="100" y1="100" y2="20" />
                <line className="text-outline-variant" opacity="0.4" stroke="currentColor" strokeWidth="0.5" x1="100" x2="176" y1="100" y2="64" />
                <line className="text-outline-variant" opacity="0.4" stroke="currentColor" strokeWidth="0.5" x1="100" x2="176" y1="100" y2="136" />
                <line className="text-outline-variant" opacity="0.4" stroke="currentColor" strokeWidth="0.5" x1="100" x2="100" y1="100" y2="180" />
                <line className="text-outline-variant" opacity="0.4" stroke="currentColor" strokeWidth="0.5" x1="100" x2="24" y1="100" y2="136" />
                <line className="text-outline-variant" opacity="0.4" stroke="currentColor" strokeWidth="0.5" x1="100" x2="24" y1="100" y2="64" />
                {/* Candidate Shape */}
                <polygon
                  className="text-primary"
                  fill="currentColor"
                  fillOpacity="0.18"
                  points="100,28 165,72 158,130 100,165 38,128 40,70"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                {/* Marker Dots */}
                <circle className="fill-primary" cx="100" cy="28" r="3.5" />
                <circle className="fill-primary" cx="165" cy="72" r="3.5" />
                <circle className="fill-primary" cx="158" cy="130" r="3.5" />
                <circle className="fill-primary" cx="100" cy="165" r="3.5" />
                <circle className="fill-primary" cx="38" cy="128" r="3.5" />
                <circle className="fill-primary" cx="40" cy="70" r="3.5" />
                {/* Labels */}
                <text className="fill-on-surface-variant font-mono text-[8px]" textAnchor="middle" x="100" y="14">System Scale</text>
                <text className="fill-on-surface-variant font-mono text-[8px]" textAnchor="start" x="180" y="65">Modularity</text>
                <text className="fill-on-surface-variant font-mono text-[8px]" textAnchor="start" x="180" y="140">Algorithms</text>
                <text className="fill-on-surface-variant font-mono text-[8px]" textAnchor="middle" x="100" y="194">Tooling/IaC</text>
                <text className="fill-on-surface-variant font-mono text-[8px]" textAnchor="end" x="20" y="140">Resilience</text>
                <text className="fill-on-surface-variant font-mono text-[8px]" textAnchor="end" x="20" y="65">OSS Output</text>
              </svg>
            </div>

            {/* Quick Summary metrics */}
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-outline-variant/30">
              <div className="p-2.5 rounded-lg bg-surface-container-low">
                <span className="text-[11px] font-mono text-on-surface-variant block">Primary Stride</span>
                <span className="text-xs font-semibold text-on-surface">Event Queues</span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-container-low">
                <span className="text-[11px] font-mono text-on-surface-variant block">Next Bottleneck</span>
                <span className="text-xs font-semibold text-error">Cloud Topology</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Market Alignment Comparison Matrix Module */}
      <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-xs overflow-hidden space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs uppercase font-bold text-tertiary font-mono">Market Intelligence</span>
              <span className="text-on-surface-variant text-xs font-mono">• 3-Way Benchmark</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-on-surface font-headline">
              Market Alignment Comparison Matrix
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant">
              Empirical comparative analysis across verified production competencies in Tier-1 software organizations.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-mono text-xs">
              Sample: 4,820 Engineers
            </span>
          </div>
        </div>

        {/* Comparison Matrix Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-mono uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 rounded-l-xl">Competency Area</th>
                <th className="py-3 px-4 text-on-surface font-bold">{userName} (You)</th>
                <th className="py-3 px-4">Avg Senior Eng</th>
                <th className="py-3 px-4">Top 10% Staff Eng</th>
                <th className="py-3 px-4 rounded-r-xl">Staff Delta Index</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {/* Row 1 */}
              <tr className="hover:bg-surface-container-low/50 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-on-surface text-xs">System Architecture & Scalability</div>
                  <div className="text-[11px] text-on-surface-variant">Event-driven, CQRS, multi-region partitioning</div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-primary">88</span>
                    <div className="w-20 bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: "88%" }} />
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-on-surface-variant">76 / 100</td>
                <td className="py-3.5 px-4 text-on-surface font-semibold">92 / 100</td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] font-bold">
                    +12% vs Avg
                  </span>
                </td>
              </tr>
              {/* Row 2 */}
              <tr className="hover:bg-surface-container-low/50 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-on-surface text-xs">Code Quality & Clean Refactoring</div>
                  <div className="text-[11px] text-on-surface-variant">Modular decoupling, semantic tests, typing rigor</div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-primary">91</span>
                    <div className="w-20 bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: "91%" }} />
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-on-surface-variant">78 / 100</td>
                <td className="py-3.5 px-4 text-on-surface font-semibold">90 / 100</td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold">
                    Staff Level (+1%)
                  </span>
                </td>
              </tr>
              {/* Row 3 */}
              <tr className="hover:bg-surface-container-low/50 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-on-surface text-xs">Cloud Observability & SRE Tooling</div>
                  <div className="text-[11px] text-on-surface-variant">Terraform, K8s operators, Grafana, alerts</div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-error">64</span>
                    <div className="w-20 bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                      <div className="bg-error h-full rounded-full" style={{ width: "64%" }} />
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-on-surface-variant">72 / 100</td>
                <td className="py-3.5 px-4 text-on-surface font-semibold">88 / 100</td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-error-container text-on-error-container text-[11px] font-bold">
                    -8% vs Avg
                  </span>
                </td>
              </tr>
              {/* Row 4 */}
              <tr className="hover:bg-surface-container-low/50 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-on-surface text-xs">DSA & Algorithmic Throughput</div>
                  <div className="text-[11px] text-on-surface-variant">Graph traversals, dynamic programming, runtime safety</div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-primary">{scores.interview || 82}</span>
                    <div className="w-20 bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: `${scores.interview || 82}%` }} />
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-on-surface-variant">75 / 100</td>
                <td className="py-3.5 px-4 text-on-surface font-semibold">86 / 100</td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] font-bold">
                    +7% vs Avg
                  </span>
                </td>
              </tr>
              {/* Row 5 */}
              <tr className="hover:bg-surface-container-low/50 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-on-surface text-xs">Open-Source Velocity & Ecosystem Impact</div>
                  <div className="text-[11px] text-on-surface-variant">Public repository adoption, PR velocity, mentoring</div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-tertiary">84</span>
                    <div className="w-20 bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                      <div className="bg-tertiary h-full rounded-full" style={{ width: "84%" }} />
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-on-surface-variant">68 / 100</td>
                <td className="py-3.5 px-4 text-on-surface font-semibold">89 / 100</td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-bold text-[11px]">
                    +16% vs Avg
                  </span>
                </td>
              </tr>
              {/* Row 6 */}
              <tr className="hover:bg-surface-container-low/50 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-on-surface text-xs">Executive Technical Communication</div>
                  <div className="text-[11px] text-on-surface-variant">RFC drafting, trade-off analysis, stakeholder alignment</div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-primary">87</span>
                    <div className="w-20 bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: "87%" }} />
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-on-surface-variant">82 / 100</td>
                <td className="py-3.5 px-4 text-on-surface font-semibold">94 / 100</td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] font-bold">
                    +5% vs Avg
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Bottom Benchmark Footer Callout */}
        <div className="p-4 rounded-xl bg-surface-container-low flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-primary shrink-0" />
            <div>
              <span className="text-xs font-semibold text-on-surface">Engine Assessment Verdict:</span>
              <span className="text-xs text-on-surface-variant ml-1">
                Candidate out-benchmarks 83.4% of senior developers in distributed systems. Close the IaC gap to reach top 10% Staff band.
              </span>
            </div>
          </div>
          <Link
            href="/dashboard/roadmap"
            className="px-4 py-1.5 rounded-lg bg-surface-container-lowest text-primary text-xs font-semibold shadow-xs hover:bg-surface-container transition-colors whitespace-nowrap cursor-pointer"
          >
            Launch Target IaC Sprint
          </Link>
        </div>
      </div>

      {/* 6. Connected Telemetry Channels & Profile Sync */}
      <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-xs space-y-6">
        <div>
          <h4 className="text-base font-bold text-on-surface font-headline">Connected Telemetry Channels</h4>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Audit and sync your public profiles to enrich DevLeveler&apos;s developer intelligence engines.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* LinkedIn Sync Form */}
          <form onSubmit={handleLinkedInSubmit} className="space-y-4">
            <div className="flex items-center gap-2">
              <LinkedinIcon className="h-5 w-5 text-blue-600" />
              <span className="text-xs font-bold text-on-surface">Sync LinkedIn Profile</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase font-mono font-bold text-on-surface-variant tracking-wider">
                Profile URL
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="w-full rounded-xl border border-outline-variant/50 bg-surface-container-lowest px-3.5 py-2.5 text-xs text-on-surface placeholder:text-outline focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase font-mono font-bold text-on-surface-variant tracking-wider flex items-center justify-between">
                <span>Paste Bio / Summary (Optional)</span>
                <span className="text-[10px] text-outline font-normal uppercase tracking-normal">
                  Helps audit private sections
                </span>
              </label>
              <textarea
                value={linkedinBio}
                onChange={(e) => setLinkedinBio(e.target.value)}
                placeholder="Paste your LinkedIn Summary, About, or Experience texts here..."
                rows={3}
                className="w-full rounded-xl border border-outline-variant/50 bg-surface-container-lowest px-3.5 py-2.5 text-xs text-on-surface placeholder:text-outline focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none shadow-xs"
              />
            </div>

            <button
              type="submit"
              disabled={analyzing}
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-primary-container py-2.5 text-xs font-semibold text-white hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer shadow-xs"
            >
              {analyzing ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Auditing Profile...</span>
                </>
              ) : (
                <span>Sync LinkedIn Profile</span>
              )}
            </button>
          </form>

          {/* Quick Channels Audit Status */}
          <div className="space-y-4 bg-surface-container-low p-5 rounded-xl border border-outline-variant/30 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-mono font-bold text-on-surface-variant uppercase tracking-wider block mb-3">
                Connected Telemetry Audit
              </span>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-on-surface font-medium">
                    <GithubIcon className="h-4 w-4 text-on-surface-variant" />
                    <span>GitHub Integration</span>
                  </div>
                  {connectedAccounts?.github ? (
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="h-3.5 w-3.5" /> ACTIVE ({connectedAccounts.github})
                    </span>
                  ) : (
                    <span className="text-[11px] text-outline font-mono">NOT CONNECTED</span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-on-surface font-medium">
                    <LinkedinIcon className="h-4 w-4 text-on-surface-variant" />
                    <span>LinkedIn Sync</span>
                  </div>
                  {report?.linkedin || connectedAccounts?.linkedin ? (
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="h-3.5 w-3.5" /> ACTIVE
                    </span>
                  ) : (
                    <span className="text-[11px] text-outline font-mono">NOT SYNCED</span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-on-surface font-medium">
                    <FileCode className="h-4 w-4 text-on-surface-variant" />
                    <span>Resume Analysis</span>
                  </div>
                  {report?.resume ? (
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="h-3.5 w-3.5" /> ACTIVE
                    </span>
                  ) : (
                    <span className="text-[11px] text-outline font-mono">NO RESUME</span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-on-surface font-medium">
                    <Globe className="h-4 w-4 text-on-surface-variant" />
                    <span>Portfolio Website</span>
                  </div>
                  {report?.portfolio ? (
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="h-3.5 w-3.5" /> ACTIVE
                    </span>
                  ) : (
                    <span className="text-[11px] text-outline font-mono">NO PORTFOLIO</span>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-outline-variant/30 pt-3 text-[11px] text-on-surface-variant leading-relaxed">
              * To connect additional telemetry, update usernames in the{" "}
              <Link href="/dashboard/settings" className="text-primary font-semibold hover:underline">
                Settings Tab
              </Link>
              . DevLeveler aggregates signals automatically.
            </div>
          </div>
        </div>
      </div>

      {/* 7. Secondary Photographic Banner: Engineering Culture */}
      <div className="rounded-2xl bg-surface-container-low border border-outline-variant/30 p-6 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden shadow-xs shrink-0 bg-surface-container-high">
            <Image
              src="/avatar-sample.png"
              alt="Engineering team"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-secondary">
              Verified Talent Protocol
            </span>
            <h3 className="text-base font-bold text-on-surface font-headline">Your Dossier is Shareable with Hiring Teams</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Cryptographically signed intelligence dossier allows hiring managers to bypass trivial LeetCode screens directly into architectural discussion rounds.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleExportDossier}
            className="px-4 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface text-xs font-semibold shadow-xs hover:bg-surface-container border border-outline-variant/40 transition-colors cursor-pointer"
          >
            Export Dossier
          </button>
          <Link
            href="/dashboard/roadmap"
            className="px-4 py-2.5 rounded-xl bg-primary-container text-white text-xs font-semibold shadow-xs hover:opacity-95 transition-opacity cursor-pointer"
          >
            Launch Target Sprint
          </Link>
        </div>
      </div>
    </div>
  );
}

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
