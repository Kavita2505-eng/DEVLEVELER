"use client";

import { motion } from "motion/react";
import { 
  GraduationCap, 
  Code2, 
  Briefcase, 
  UserCheck, 
  HelpCircle, 
  Workflow, 
  LineChart, 
  Sparkles,
  CheckCircle2
} from "lucide-react";

const TARGETS = [
  {
    icon: GraduationCap,
    role: "Students",
    color: "from-blue-500 to-indigo-500",
    bgMuted: "bg-blue-500/10",
    textAccent: "text-blue-400",
    description: "Translate academic projects and basic codebases into industry-ready portfolios. Identify exact gaps in your skills compared to hiring standards.",
    useCase: "Build real-world proof-of-work before graduation."
  },
  {
    icon: Code2,
    role: "Developers",
    color: "from-cyan-400 to-blue-500",
    bgMuted: "bg-cyan-500/10",
    textAccent: "text-cyan-400",
    description: "Analyze your repository structures, commit velocities, and language distributions to break through career plateaus and target senior roles.",
    useCase: "Continuous self-audit of code quality & telemetry."
  },
  {
    icon: Briefcase,
    role: "Job Seekers",
    color: "from-purple-500 to-pink-500",
    bgMuted: "bg-purple-500/10",
    textAccent: "text-purple-400",
    description: "Audit resumes against strict ATS keyword filters, identify missing target role terminologies, and optimize your developer portfolio's performance.",
    useCase: "Max out application match rates for target roles."
  },
  {
    icon: UserCheck,
    role: "Internship Candidates",
    color: "from-emerald-400 to-teal-500",
    bgMuted: "bg-emerald-500/10",
    textAccent: "text-emerald-400",
    description: "Evaluate early-stage project structures against production requirements, generate structured learning milestones, and stand out in recruitment directories.",
    useCase: "Get clear instructions on landing your first tech role."
  }
];

const EXPLANATIONS = [
  {
    icon: HelpCircle,
    title: "What DevLeveler Does",
    description: "DevLeveler is a career intelligence platform that audits your public GitHub repositories, analyzes your resume's ATS compliance, and checks your portfolio's performance to provide a unified Developer Score and growth instructions."
  },
  {
    icon: Workflow,
    title: "How It Works",
    description: "Simply connect your public GitHub username (no write access required) and upload your resume. We parse and cross-reference your codebase patterns and resume data against thousands of industry-standard roles to find gaps."
  },
  {
    icon: LineChart,
    title: "What Insights You Receive",
    description: "Receive a transparent Developer Score, granular compatibility scores for startups and enterprises, a checklist of missing high-priority technologies, and a customized 12-week roadmap with weekly milestones."
  },
  {
    icon: Sparkles,
    title: "Why Create an Account?",
    description: "Stop guessing your readiness. An account unlocks interactive roadmaps, lets you track score updates over time, access targeted interview preparation questions, and verify your profile with clean public verification links."
  }
];

export function About() {
  return (
    <section id="about" className="relative py-24 border-t border-[var(--border)] bg-[var(--background-secondary)]/15">
      {/* Visual background glows */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[300px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[300px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-6">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-[10px] font-bold text-[var(--accent)] uppercase tracking-wider">
            About DevLeveler
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl gradient-text">
            Built for the Next Generation of Builders
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[var(--foreground-secondary)] leading-relaxed">
            Career intelligence shouldn&apos;t be a black box. DevLeveler gives you direct, telemetry-based insights 
            to identify skill gaps, optimize credentials, and verify your actual readiness.
          </p>
        </motion.div>

        {/* 1. Who is it for? */}
        <div className="mt-20">
          <motion.h3 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-lg font-bold text-center text-white uppercase tracking-wider mb-10"
          >
            Who is DevLeveler for?
          </motion.h3>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TARGETS.map((target, idx) => (
              <motion.div
                key={target.role}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="card-base p-6 border-[var(--border)] bg-[var(--card)] hover:border-zinc-800 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${target.bgMuted}`}>
                    <target.icon className={`h-5 w-5 ${target.textAccent}`} />
                  </div>
                  <h4 className="text-base font-bold text-white">
                    {target.role}
                  </h4>
                  <p className="text-xs text-[var(--foreground-secondary)] leading-relaxed">
                    {target.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                  <span className="text-[10px] font-semibold text-zinc-400">
                    {target.useCase}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 2. What, How, Insights, Why */}
        <div className="mt-24 pt-12 border-t border-[var(--border)]/65">
          <div className="grid gap-8 md:grid-cols-2">
            {EXPLANATIONS.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex gap-4 p-5 card-base border-[var(--border)] bg-[var(--card)]/40"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-muted)] shrink-0">
                  <item.icon className="h-5 w-5 text-[var(--accent)]" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-sm font-bold text-white">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[var(--foreground-secondary)] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
