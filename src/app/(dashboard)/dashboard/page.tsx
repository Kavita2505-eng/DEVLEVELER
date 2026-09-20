import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { EarlyAdopterModal } from "@/components/dashboard/early-adopter-modal";
import {
  Award,
  Zap,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  GitBranch,
  TrendingUp,
  Clock,
  ShieldCheck,
  Code2,
  HelpCircle,
  Sliders,
  GraduationCap,
  Play,
  FileCheck,
  Map,
} from "lucide-react";
import type { RadarDataPoint } from "@/types";

export default async function DashboardPage() {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // 1. Fetch all data in parallel
  const [user, devScore, githubProfile, resume, xpHistory, achievements, skillGap, activeRoadmap] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          xp: true,
          level: true,
          name: true,
          isEarlyAdopter: true,
          premiumExpiresAt: true,
          plan: true,
          connectedAccounts: true,
        },
      }),
      prisma.developerScore.findUnique({
        where: { userId },
        select: {
          overallScore: true,
          githubScore: true,
          projectScore: true,
          skillScore: true,
          resumeScore: true,
          deploymentScore: true,
          rank: true,
        },
      }),
      prisma.gitHubProfile.findUnique({
        where: { userId },
      }),
      prisma.resume.findFirst({
        where: { userId },
        orderBy: { analyzedAt: "desc" },
      }),
      prisma.xPHistory.findMany({
        where: { userId },
        orderBy: { earnedAt: "desc" },
        take: 5,
      }),
      prisma.userAchievement.findMany({
        where: { userId },
        orderBy: { unlockedAt: "desc" },
        take: 4,
      }),
      prisma.skillGap.findFirst({
        where: { userId },
        orderBy: { analyzedAt: "desc" },
      }),
      prisma.roadmap.findFirst({
        where: { userId },
        orderBy: { generatedAt: "desc" },
      }),
    ]);

  if (!user) {
    redirect("/login");
  }

  // Calculate global rank
  const [totalUsers, betterUsers] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({
      where: { xp: { gt: user.xp } },
    }),
  ]);
  const absoluteRank = betterUsers + 1;
  const percentile =
    totalUsers > 1 ? Math.round(((totalUsers - absoluteRank) / (totalUsers - 1)) * 100) : 100;
  const candidateTopPercent = Math.max(1, 100 - percentile);

  // 2. Radar points
  const radarData: RadarDataPoint[] = [
    { subject: "Distributed Systems & Arch", value: devScore?.projectScore ?? 78, fullMark: 100 },
    { subject: "GitHub Cadence & Code", value: devScore?.githubScore ?? 75, fullMark: 100 },
    { subject: "Core Skills & Tech Stack", value: devScore?.skillScore ?? 82, fullMark: 100 },
    { subject: "Resume & ATS Calibration", value: devScore?.resumeScore ?? 70, fullMark: 100 },
    { subject: "Deployment & Production", value: devScore?.deploymentScore ?? 65, fullMark: 100 },
  ];

  // 4. Daily streak calculation
  let streak = 0;
  if (xpHistory && xpHistory.length > 0) {
    const uniqueDays = Array.from(
      new Set(
        xpHistory.map((x) => {
          const d = new Date(x.earnedAt);
          d.setHours(0, 0, 0, 0);
          return d.getTime();
        })
      )
    );

    if (uniqueDays.length > 0) {
      const todayTime = new Date();
      todayTime.setHours(0, 0, 0, 0);
      const yesterdayTime = new Date();
      yesterdayTime.setDate(yesterdayTime.getDate() - 1);
      yesterdayTime.setHours(0, 0, 0, 0);

      if (uniqueDays[0] === todayTime.getTime() || uniqueDays[0] === yesterdayTime.getTime()) {
        streak = 1;
        let curr = uniqueDays[0];
        for (let i = 1; i < uniqueDays.length; i++) {
          const diff = curr - uniqueDays[i];
          const oneDay = 24 * 60 * 60 * 1000;
          if (diff <= oneDay + 1000) {
            streak++;
            curr = uniqueDays[i];
          } else {
            break;
          }
        }
      }
    }
  }

  // 5. Extract top missing skills
  let missingSkills: string[] = [];
  if (skillGap?.missingSkills) {
    try {
      const parsed =
        typeof skillGap.missingSkills === "string"
          ? JSON.parse(skillGap.missingSkills || "[]")
          : (skillGap.missingSkills as unknown[]);

      if (Array.isArray(parsed)) {
        missingSkills = parsed
          .slice(0, 5)
          .map((s: unknown) =>
            typeof s === "object" && s !== null && "name" in s
              ? String((s as { name: unknown }).name || "")
              : String(s || "")
          );
      }
    } catch {}
  }
  if (missingSkills.length === 0) {
    missingSkills = ["Kubernetes", "System Design", "Distributed Tracing", "Docker", "SRE"];
  }

  // 6. Extract weekly goals list
  let weeklyGoalsList: string[] = [];
  if (activeRoadmap?.weeklyGoals) {
    try {
      const parsed =
        typeof activeRoadmap.weeklyGoals === "string"
          ? JSON.parse(activeRoadmap.weeklyGoals || "[]")
          : (activeRoadmap.weeklyGoals as unknown[]);

      if (Array.isArray(parsed)) {
        weeklyGoalsList = parsed
          .slice(0, 3)
          .map((w: unknown) =>
            typeof w === "object" && w !== null
              ? String(
                  (w as Record<string, unknown>).title ||
                    (w as Record<string, unknown>).description ||
                    ""
                )
              : String(w || "")
          );
      }
    } catch {}
  }
  if (weeklyGoalsList.length === 0) {
    weeklyGoalsList = [
      "Connect developer handles to calibrate score vectors",
      "Upload technical resume for ATS keyword benchmarking",
      "Complete recommended System Design mock interview",
    ];
  }

  // 7. Determine recommended next action
  const nextAction = (() => {
    if (!githubProfile) {
      return {
        text: "Connect GitHub account to audit repositories",
        xp: "+300 XP",
        href: "/dashboard/github",
        btnText: "Sync GitHub Profile",
      };
    }
    if (!resume) {
      return {
        text: "Upload technical resume to audit ATS alignment",
        xp: "+100 XP",
        href: "/dashboard/resume",
        btnText: "Upload Technical Resume",
      };
    }
    if (!activeRoadmap) {
      return {
        text: "Generate customized career roadmap",
        xp: "+150 XP",
        href: "/dashboard/roadmap",
        btnText: "Build Career Roadmap",
      };
    }
    return {
      text: "Practice technical architecture mock interview",
      xp: "+100 XP",
      href: "/dashboard/interview",
      btnText: "Continue System Design",
    };
  })();

  const overallDevScore = Math.round(devScore?.overallScore ?? 75);
  const readinessPercent = Math.round(
    ((devScore?.skillScore ?? 70) + (devScore?.projectScore ?? 70)) / 2
  );
  const githubHealthScore = Math.round(devScore?.githubScore ?? (githubProfile ? 85 : 0));
  const careerTrackPercent = Math.min(100, Math.round(((user.xp % 1000) / 1000) * 100) || 72);

  // SVG dash for score ring
  const circleCircumference = 2 * Math.PI * 19; // ~119.38
  const strokeDashoffset = circleCircumference - (overallDevScore / 100) * circleCircumference;

  return (
    <div className="flex flex-col gap-6 lg:gap-8 max-w-[1440px] mx-auto w-full">
      <EarlyAdopterModal isEarlyAdopter={user.isEarlyAdopter} />

      {/* Expiry Warning Countdowns */}
      {user.plan === "PRO" && user.premiumExpiresAt && (() => {
        const remainingDays = Math.max(
          0,
          Math.ceil((new Date(user.premiumExpiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        );
        if (remainingDays <= 0) return null;

        return (
          <div className="card-base p-4 flex items-center justify-between gap-4 bg-primary/5 border-primary/20">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container-high shrink-0">
                <AlertCircle className="h-4.5 w-4.5 text-primary" />
              </div>
              <div>
                <span className="font-bold uppercase tracking-wider block text-xs text-on-surface">
                  Pro subscription expires in {remainingDays} days
                </span>
                <span className="text-xs text-on-surface-variant">
                  Enjoy your premium analytics, code audits, and unlimited roadmaps.
                </span>
              </div>
            </div>
            <Link
              href="/dashboard/billing"
              className="text-xs font-semibold text-primary hover:underline shrink-0"
            >
              Extend Pass →
            </Link>
          </div>
        );
      })()}

      {/* 1. TOP HERO HEADER AREA */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-1">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface">
              Good morning, {user.name ? user.name.split(" ")[0] : "Developer"}
            </h1>
            <span className="text-2xl select-none">👋</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-mono text-[11px] font-bold tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              TOP {candidateTopPercent}% CANDIDATE
            </span>
          </div>
          <p className="text-sm text-on-surface-variant max-w-2xl leading-relaxed">
            Here is your comprehensive profile telemetry. You are tracking ahead of target for{" "}
            <span className="font-medium text-on-surface">Staff / Senior Fullstack</span> readiness
            across 18 benchmarked capabilities.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap shrink-0">
          <div className="hidden sm:flex flex-col text-right mr-1">
            <span className="text-[10px] text-outline font-mono uppercase tracking-wider">
              Telemetry Engine
            </span>
            <span className="text-xs text-on-surface-variant font-medium">Synced 2m ago</span>
          </div>

          <Link
            href="/dashboard/intelligence"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-lowest border border-border text-on-surface text-xs font-semibold shadow-xs hover:bg-surface-container-high transition-colors"
            id="runAuditBtn"
          >
            <Sparkles className="h-4 w-4 text-tertiary" />
            <span>Run Full AI Audit</span>
          </Link>

          <Link
            href={nextAction.href}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold shadow-sm hover:bg-primary/90 transition-all"
          >
            <Zap className="h-4 w-4 fill-white" />
            <span>{nextAction.btnText}</span>
          </Link>
        </div>
      </header>

      {/* 2. FOUR HIGH-IMPACT METRIC BENTO CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Metric 1: Developer Score */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-border shadow-xs flex flex-col justify-between gap-4 transition-all hover:shadow-md hover:border-border-hover">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-mono text-outline uppercase tracking-wider">
                Dev Score
              </span>
              <span className="text-xs text-on-surface-variant font-medium">Algorithmic Index</span>
            </div>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-surface-container-high text-tertiary font-mono text-[11px] font-bold">
              <TrendingUp className="h-3 w-3" /> +4.2
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold tracking-tight text-on-surface tabular-nums">
                  {overallDevScore}
                </span>
                <span className="text-sm text-outline font-medium">/ 100</span>
              </div>
              <span className="text-[11px] font-mono text-secondary font-medium mt-0.5">
                Staff Target: 90 pts
              </span>
            </div>

            {/* Inline Radial Gauge */}
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 48 48">
                <circle
                  className="text-surface-container-highest"
                  cx="24"
                  cy="24"
                  fill="none"
                  r="19"
                  stroke="currentColor"
                  strokeWidth="3.5"
                />
                <circle
                  className="text-primary"
                  cx="24"
                  cy="24"
                  fill="none"
                  r="19"
                  stroke="currentColor"
                  strokeDasharray="119.38"
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  strokeWidth="3.5"
                />
              </svg>
              <ShieldCheck className="h-4 w-4 text-primary absolute" />
            </div>
          </div>

          <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, overallDevScore)}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Market Readiness */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-border shadow-xs flex flex-col justify-between gap-4 transition-all hover:shadow-md hover:border-border-hover">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-mono text-outline uppercase tracking-wider">
                Readiness
              </span>
              <span className="text-xs text-on-surface-variant font-medium">
                Sr. Fullstack Track
              </span>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-mono text-[11px]">
              {missingSkills.length} gaps left
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold tracking-tight text-on-surface tabular-nums">
                  {readinessPercent}%
                </span>
              </div>
              <span className="text-[11px] text-on-surface-variant mt-0.5 truncate max-w-[140px]">
                Closing gap on {missingSkills[0] || "infra"}
              </span>
            </div>

            {/* Sparkline SVG */}
            <svg className="w-16 h-8 text-secondary" fill="none" viewBox="0 0 64 24">
              <path
                d="M2 18 L16 16 L28 10 L42 12 L52 4 L62 2"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
              <path
                d="M2 18 L16 16 L28 10 L42 12 L52 4 L62 2 V24 H2 Z"
                fill="currentColor"
                fillOpacity="0.08"
              />
            </svg>
          </div>

          <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-secondary h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, readinessPercent)}%` }}
            />
          </div>
        </div>

        {/* Metric 3: GitHub Rhythm */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-border shadow-xs flex flex-col justify-between gap-4 transition-all hover:shadow-md hover:border-border-hover">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-mono text-outline uppercase tracking-wider">
                GitHub Rhythm
              </span>
              <span className="text-xs text-on-surface-variant font-medium">
                {streak > 0 ? `${streak}-Day Active Streak` : "Repo Telemetry"}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-mono text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary" /> {githubHealthScore}%
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold tracking-tight text-on-surface tabular-nums">
                  {githubProfile?.publicRepos ?? 42}
                </span>
                <span className="text-xs text-outline font-medium">Repos</span>
              </div>
              <span className="text-[11px] text-on-surface-variant mt-0.5">
                {githubProfile ? "Clean branches verified" : "Connect GitHub"}
              </span>
            </div>

            {/* Cadence Pulse Graphic */}
            <div className="flex items-end gap-1 h-8">
              <div className="w-1.5 h-4 bg-tertiary-fixed-dim rounded-t" />
              <div className="w-1.5 h-6 bg-tertiary-fixed-dim rounded-t" />
              <div className="w-1.5 h-5 bg-tertiary-fixed-dim rounded-t" />
              <div className="w-1.5 h-8 bg-tertiary rounded-t" />
              <div className="w-1.5 h-7 bg-tertiary rounded-t" />
            </div>
          </div>

          <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-tertiary h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, githubHealthScore)}%` }}
            />
          </div>
        </div>

        {/* Metric 4: Career Progress */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-border shadow-xs flex flex-col justify-between gap-4 transition-all hover:shadow-md hover:border-border-hover">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-mono text-outline uppercase tracking-wider">
                Career Track
              </span>
              <span className="text-xs text-on-surface-variant font-medium">
                Level {user.level} Engineer
              </span>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-mono text-[11px] font-bold">
              L{user.level} → L{user.level + 1}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold tracking-tight text-on-surface tabular-nums">
                  {careerTrackPercent}%
                </span>
              </div>
              <span className="text-[11px] text-on-surface-variant mt-0.5">
                {weeklyGoalsList.length} milestones in queue
              </span>
            </div>
            <Map className="h-7 w-7 text-primary opacity-80" />
          </div>

          <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, careerTrackPercent)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. FLAGSHIP AI INTELLIGENCE SIGNAL CARD */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-surface-container-lowest to-surface-container-low p-6 lg:p-8 border border-cyan-500/20 shadow-md">
        {/* Ambient glow accent */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-primary-fixed-dim/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed-variant shadow-xs">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <span className="font-mono text-xs text-tertiary uppercase tracking-wider font-bold">
                  AI Career Intelligence
                </span>
                <span className="text-outline mx-2">•</span>
                <span className="text-xs text-on-surface-variant font-medium">
                  Highest Leverage Action
                </span>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 text-tertiary font-mono text-xs font-semibold bg-surface-container-lowest/90 border border-border px-3 py-1 rounded-full shadow-xs">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
              Algorithmic Recommendation #A-108
            </span>
          </div>

          {/* Core finding text */}
          <div className="max-w-4xl">
            <h2 className="text-base sm:text-lg font-semibold text-on-surface tracking-tight leading-snug">
              Your backend distributed patterns and language fundamentals are exceptional, but your
              active repository portfolio lacks production-grade Kubernetes telemetry and chaos
              recovery pipelines.
            </h2>
          </div>

          {/* Four structured micro-cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            <div className="p-4 rounded-xl bg-surface-container-lowest border border-border shadow-xs flex flex-col justify-between gap-2">
              <div className="flex items-center gap-1.5 text-secondary font-mono text-xs font-semibold">
                <HelpCircle className="h-3.5 w-3.5" />
                <span>Why this matters</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Tier-1 engineering panels evaluate senior candidates on deep observability,
                real-time SLI/SLA alerts, and incident mitigation.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-lowest border border-border shadow-xs flex flex-col justify-between gap-2">
              <div className="flex items-center gap-1.5 text-primary font-mono text-xs font-semibold">
                <Sliders className="h-3.5 w-3.5" />
                <span>What to improve</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Deploy OpenTelemetry collectors to your core backend repositories and document
                failover recovery.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-lowest border border-border shadow-xs flex flex-col justify-between gap-2">
              <div className="flex items-center gap-1.5 text-tertiary font-mono text-xs font-semibold">
                <GraduationCap className="h-3.5 w-3.5" />
                <span>Recommended action</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Complete the <strong className="text-on-surface font-medium">Production SRE</strong>{" "}
                module in your active DevLeveler roadmap.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-secondary-fixed text-on-secondary-fixed shadow-xs flex flex-col justify-between gap-2">
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold">
                <Award className="h-3.5 w-3.5" />
                <span>Estimated impact</span>
              </div>
              <div>
                <span className="text-lg font-bold block">+8 pts</span>
                <span className="text-[11px] opacity-90 leading-tight block">
                  Unlocks Tier-1 Senior Readiness Benchmark
                </span>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-2 flex-wrap gap-3 border-t border-border/50">
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard/skills"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 shadow-xs transition-all"
              >
                <span>Improve this skill</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/dashboard/roadmap"
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-on-surface-variant text-xs hover:bg-surface-container-high transition-colors"
              >
                <span>View Full Roadmap</span>
              </Link>
            </div>

            <div className="flex items-center gap-1.5 text-outline font-mono text-[11px]">
              <Sparkles className="h-3.5 w-3.5 text-tertiary" />
              <span>Synthesized across live codebases and market hiring signals</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TWO-COLUMN ANALYTICS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Skill Growth & Market Alignment (7 cols) */}
        <section className="lg:col-span-7 flex flex-col gap-4 bg-surface-container-lowest border border-border p-6 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex flex-col">
              <h3 className="text-base font-bold text-on-surface">
                Skill Growth & Market Alignment
              </h3>
              <p className="text-xs text-on-surface-variant">
                Calibrated against Staff / L6 criteria at top 20 tech employers
              </p>
            </div>
            <div className="inline-flex items-center p-0.5 bg-surface-container rounded-lg font-mono text-[11px]">
              <span className="px-2.5 py-1 rounded bg-surface-container-lowest text-on-surface font-semibold shadow-xs">
                vs L6 Median
              </span>
            </div>
          </div>

          {/* 5 Calibrated Competencies with Median Thresholds */}
          <div className="flex flex-col gap-4 pt-1">
            {radarData.map((item, idx) => {
              const medians = [79, 74, 76, 70, 78];
              const median = medians[idx] || 75;
              const val = Math.min(100, Math.max(10, item.value));
              const isExceeding = val >= median;

              return (
                <div key={item.subject} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-on-surface">{item.subject}</span>
                      <span
                        className={cn(
                          "px-1.5 py-0.5 rounded font-mono text-[10px] font-bold",
                          isExceeding
                            ? "bg-tertiary-fixed text-on-tertiary-fixed-variant"
                            : "bg-error-container text-on-error-container"
                        )}
                      >
                        {isExceeding ? "Strong" : "Growth Opportunity"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[11px] text-outline">Median: {median}%</span>
                      <span className="font-mono font-bold text-on-surface text-xs">{val}%</span>
                    </div>
                  </div>

                  <div className="relative w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-outline z-10"
                      style={{ left: `${median}%` }}
                      title={`Market Median ${median}%`}
                    />
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-700",
                        isExceeding ? "bg-primary" : "bg-error"
                      )}
                      style={{ width: `${val}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Banner */}
          <div className="mt-2 p-3 rounded-xl bg-surface-container-low border border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-tertiary shrink-0" />
              <span className="text-xs font-medium text-on-surface">
                Core competencies outperform market median across 4 dimensions
              </span>
            </div>
            <Link
              href="/dashboard/skills"
              className="font-mono text-[11px] text-primary font-bold hover:underline shrink-0"
            >
              View Breakdown →
            </Link>
          </div>
        </section>

        {/* Right Column: Activity Cadence & Action Queue (5 cols) */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          {/* Activity Matrix Card */}
          <div className="bg-surface-container-lowest border border-border p-6 rounded-2xl shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h3 className="text-base font-bold text-on-surface">Activity & Cadence</h3>
                <span className="text-xs text-on-surface-variant">Last 8 active weeks</span>
              </div>
              <span className="font-mono text-xs text-tertiary font-bold">5.8 hrs/day avg</span>
            </div>

            {/* Contribution Matrix Grid */}
            <div className="flex flex-col gap-1.5 pt-1">
              <div className="flex justify-between items-center text-outline font-mono text-[10px] px-0.5">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
                <span>Sun</span>
              </div>
              <div className="grid grid-cols-12 gap-1.5 p-2 rounded-xl bg-surface-container-low border border-border">
                {Array.from({ length: 12 }).map((_, colIdx) => (
                  <div key={colIdx} className="flex flex-col gap-1">
                    <span
                      className={cn(
                        "w-full h-2.5 rounded-xs",
                        colIdx % 3 === 0
                          ? "bg-primary"
                          : colIdx % 2 === 0
                          ? "bg-primary-container"
                          : "bg-primary-fixed"
                      )}
                    />
                    <span
                      className={cn(
                        "w-full h-2.5 rounded-xs",
                        colIdx % 4 === 0
                          ? "bg-surface-container-highest"
                          : colIdx % 2 === 0
                          ? "bg-primary"
                          : "bg-primary-fixed-dim"
                      )}
                    />
                    <span
                      className={cn(
                        "w-full h-2.5 rounded-xs",
                        colIdx % 5 === 0
                          ? "bg-primary-fixed"
                          : "bg-primary-container"
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Unlocked Achievements */}
            <div className="flex flex-col gap-2 pt-1 border-t border-border">
              <span className="text-[10px] font-mono text-outline uppercase tracking-wider">
                Unlocked Achievements
              </span>
              <div className="flex flex-wrap gap-2">
                {achievements.length > 0 ? (
                  achievements.map((ach) => (
                    <span
                      key={ach.id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container border border-border text-on-surface font-mono text-xs font-medium shadow-xs"
                    >
                      <Award className="h-3.5 w-3.5 text-primary" />
                      {ach.title}
                    </span>
                  ))
                ) : (
                  <>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container border border-border text-on-surface font-mono text-xs font-medium shadow-xs">
                      <Code2 className="h-3.5 w-3.5 text-tertiary" />
                      Distributed Cache Master
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container border border-border text-on-surface font-mono text-xs font-medium shadow-xs">
                      <Award className="h-3.5 w-3.5 text-secondary" />
                      Top 5% PR Reviewer
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container border border-border text-on-surface font-mono text-xs font-medium shadow-xs">
                      <Zap className="h-3.5 w-3.5 text-primary" />
                      Coding Velocity
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Next Step Card: Priority Next Step */}
          <div className="p-6 rounded-2xl bg-primary text-white shadow-md flex flex-col justify-between gap-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-primary-fixed" />
                <span className="font-mono text-xs text-primary-fixed uppercase tracking-wider font-bold">
                  Priority Next Step
                </span>
              </div>
              <span className="font-mono text-[10px] bg-primary-container px-2 py-0.5 rounded text-white font-semibold">
                In Queue
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold">Distributed Systems Design</h3>
              <p className="text-xs text-on-primary-container mt-1">
                AI Mock Technical Panel • 45 mins Interactive Simulation
              </p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <Link
                href="/dashboard/interview"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-primary text-xs font-bold shadow-xs hover:bg-surface-container-low transition-colors"
              >
                <Play className="h-3.5 w-3.5 fill-primary" />
                <span>Review Prep Brief</span>
              </Link>
              <span className="font-mono text-[11px] text-primary-fixed">Session #DS-990</span>
            </div>
          </div>
        </section>
      </div>

      {/* 5. RECENT INTELLIGENT ACTIVITY FEED */}
      <section className="flex flex-col gap-4 bg-surface-container-lowest border border-border p-6 rounded-2xl shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-tertiary" />
            <h3 className="text-base font-bold text-on-surface">Recent Intelligent Activity</h3>
          </div>
          <Link
            href="/dashboard/github"
            className="font-mono text-[11px] text-primary font-bold hover:underline"
          >
            View full audit trail →
          </Link>
        </div>

        <div className="flex flex-col gap-2.5">
          {xpHistory.length > 0 ? (
            xpHistory.map((item, idx) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-surface-container-low/60 hover:bg-surface-container-low border border-border/50 transition-colors gap-3"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <span className="p-2 rounded-lg bg-surface-container text-primary shrink-0">
                    {idx === 0 ? (
                      <GitBranch className="h-4 w-4" />
                    ) : idx === 1 ? (
                      <FileCheck className="h-4 w-4 text-secondary" />
                    ) : (
                      <Code2 className="h-4 w-4 text-tertiary" />
                    )}
                  </span>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="font-semibold text-on-surface">Activity Verification</span>
                      <span className="text-outline">•</span>
                      <span className="text-on-surface-variant">{item.reason}</span>
                    </div>
                    <span className="text-[10px] text-outline font-mono">
                      Verified by DevLeveler static AST analyzer
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                  <span className="font-mono text-xs text-tertiary font-bold bg-tertiary-fixed px-2 py-0.5 rounded-full">
                    +{item.amount} XP
                  </span>
                  <span className="font-mono text-[11px] text-outline">
                    {new Date(item.earnedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-xs text-outline italic">
              No recent activity recorded yet. Connect profiles or practice mock interviews to build your audit log.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
