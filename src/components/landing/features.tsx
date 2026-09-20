"use client";

import { 
  GitBranch, 
  FileText, 
  Award, 
  Target, 
  Map, 
  Globe, 
  MessageSquare, 
  Compass, 
  Check,
  Terminal
} from "lucide-react";
import { motion } from "motion/react";

const FEATURES = [
  {
    icon: GitBranch,
    title: "GitHub Analysis",
    description: "Deep analytics scanning repository metadata, stars, fork counts, commit velocities, and language distributions.",
    benefits: ["Tracks activity volume", "Calculates repository health"],
    color: "from-blue-500/20 to-cyan-500/10",
    visual: (
      <div className="p-3 bg-zinc-950/60 rounded-xl border border-white/5 text-[9px] space-y-1.5 font-mono text-zinc-400">
        <div className="flex justify-between items-center text-zinc-400">
          <span>repo: devleveler-core</span>
          <span className="text-[8px] text-cyan-400 font-bold">★ 142</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full w-[80%]" />
        </div>
      </div>
    )
  },
  {
    icon: FileText,
    title: "Resume Analysis",
    description: "Upload resumes in PDF format to parse text and test ATS compatibility issues, warning you of missing keywords.",
    benefits: ["ATS keyword compliance", "Formatting layout audit"],
    color: "from-cyan-500/20 to-purple-500/10",
    visual: (
      <div className="p-3 bg-zinc-950/60 rounded-xl border border-white/5 flex items-center justify-between text-[9px] font-mono text-zinc-400">
        <div>
          <span className="text-zinc-500 block">ATS Scanner</span>
          <span className="text-[8px] text-emerald-400 font-bold block mt-0.5">89% Match Rate</span>
        </div>
        <FileText className="h-5 w-5 text-emerald-400 shrink-0" />
      </div>
    )
  },
  {
    icon: Award,
    title: "Developer Score",
    description: "A composite, transparent scoring engine aggregating activity, code quality, and skills without hidden formulas.",
    benefits: ["Weighted metrics weights", "Community leaderboard rank"],
    color: "from-purple-500/20 to-pink-500/10",
    visual: (
      <div className="p-3 bg-zinc-950/60 rounded-xl border border-white/5 flex items-center justify-center gap-2 text-zinc-400">
        <span className="text-xl font-black text-white font-mono">84</span>
        <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-bold border border-zinc-800 bg-zinc-900 px-2 py-0.5 rounded-full">Explorer II</span>
      </div>
    )
  },
  {
    icon: Target,
    title: "Skill Gap Detection",
    description: "Compares current technologies with industry standards to highlight library, framework, or utility deficiencies.",
    benefits: ["Targeted requirements matching", "Learning resource mappings"],
    color: "from-pink-500/20 to-rose-500/10",
    visual: (
      <div className="p-3 bg-zinc-950/60 rounded-xl border border-white/5 flex flex-wrap gap-1 justify-center">
        <span className="px-2 py-0.5 bg-red-950/30 border border-red-900/30 text-[8px] rounded-full text-red-400 font-bold font-mono">Missing: Docker</span>
        <span className="px-2 py-0.5 bg-amber-950/30 border border-amber-900/30 text-[8px] rounded-full text-amber-400 font-bold font-mono">Missing: Redis</span>
      </div>
    )
  },
  {
    icon: Map,
    title: "Career Roadmaps",
    description: "Generates structured 12-week roadmaps complete with weekly targets and monthly milestones to address skill gaps.",
    benefits: ["Progress check tracking", "Targeted project suggestions"],
    color: "from-blue-500/20 to-indigo-500/10",
    visual: (
      <div className="p-3 bg-zinc-950/60 rounded-xl border border-white/5 space-y-1.5 font-mono text-[9px] text-zinc-400">
        <div className="flex gap-2 items-center">
          <div className="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
          <span>Week 1: Dockerize PG Client</span>
        </div>
        <div className="flex gap-2 items-center">
          <div className="h-1.5 w-1.5 rounded-full border border-zinc-700 shrink-0" />
          <span className="text-zinc-600">Week 2: Set Redis Adapters</span>
        </div>
      </div>
    )
  },
  {
    icon: Globe,
    title: "Portfolio Analysis",
    description: "Audits portfolios for loading speeds, accessibility violations, mobile responsiveness, and design structure grades.",
    benefits: ["PageSpeed performance grades", "UX layout heuristics check"],
    color: "from-emerald-500/20 to-teal-500/10",
    visual: (
      <div className="p-3 bg-zinc-950/60 rounded-xl border border-white/5 flex justify-between items-center text-[9px] font-mono text-zinc-400">
        <span>SEO Core: 100/100</span>
        <span className="text-emerald-400 font-bold">Grade A+</span>
      </div>
    )
  },
  {
    icon: MessageSquare,
    title: "Interview Readiness",
    description: "Provides structured HR, technical, and project question scenarios tailored specifically to your target tracks.",
    benefits: ["Sample answer breakdowns", "Difficulty configurations"],
    color: "from-purple-500/20 to-indigo-500/10",
    visual: (
      <div className="p-3 bg-zinc-950/60 rounded-xl border border-white/5 text-[9px] text-zinc-400 space-y-1">
        <span className="text-zinc-500 font-bold uppercase text-[7px] tracking-wider">Question Mock</span>
        <p className="italic leading-normal">How do you scale stateful APIs in container clusters?</p>
      </div>
    )
  },
  {
    icon: Compass,
    title: "Career Coach",
    description: "Telemetry-driven guidelines, learning suggestions, and structured career instructions. Transparent and invisible.",
    benefits: ["Metrics-focused guidance", "No automated chat wrappers"],
    color: "from-pink-500/20 to-purple-500/10",
    visual: (
      <div className="p-3 bg-zinc-950/60 rounded-xl border border-white/5 flex items-center gap-2 text-[9px] text-zinc-400 font-mono">
        <Terminal className="h-4 w-4 text-cyan-400 animate-pulse" />
        <span>Deploying roadmap targets...</span>
      </div>
    )
  }
];

export function Features() {
  return (
    <section id="features" className="relative py-28 bg-zinc-950 border-t border-white/5">
      
      {/* Background blurs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[450px] h-[450px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 w-[450px] h-[450px] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-6 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-950/20 border border-indigo-800/30 px-3.5 py-1 text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
            Features
          </div>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl text-white">
            Everything You Need To Level Up
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed font-medium">
            A complete career intelligence toolkit built to analyze, optimize, and verify your technical competencies.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="premium-glass-card p-5 rounded-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              id={`feature-card-${idx}`}
            >
              <div className="space-y-4">
                {/* Header Icon + Title */}
                <div className="flex items-center gap-3">
                  <div className="flex h-9.5 w-9.5 items-center justify-center rounded-xl bg-white/5 border border-white/10 shadow-lg">
                    <item.icon className="h-4.5 w-4.5 text-cyan-400" />
                  </div>
                  <h3 className="text-sm font-extrabold text-white">
                    {item.title}
                  </h3>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                  {item.description}
                </p>

                {/* Benefits Bullet Points */}
                <ul className="space-y-1.5 pt-1">
                  {item.benefits.map((b, bIdx) => (
                    <li key={bIdx} className="flex gap-2 items-start text-[11px] text-zinc-400 font-semibold">
                      <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visual preview */}
              <div className="mt-5 pt-3.5 border-t border-white/5">
                {item.visual}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
