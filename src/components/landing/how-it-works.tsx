"use client";

import { GitBranch, FileText, Target, Compass } from "lucide-react";
import { motion } from "motion/react";

const STEPS = [
  {
    number: "01",
    title: "Connect GitHub",
    description: "Link your public GitHub profile. We scan your repositories, commits, code quality, and language distributions.",
    icon: GitBranch,
    color: "from-blue-500 to-indigo-500",
    glow: "shadow-blue-500/10",
    visual: (
      <div className="flex flex-col items-center justify-center p-4 bg-zinc-950/60 rounded-2xl border border-white/5 w-full max-w-[220px] h-[125px] relative overflow-hidden">
        <GitBranch className="h-7 w-7 text-blue-400 mb-2.5 animate-bounce" />
        <span className="text-[9px] font-mono text-zinc-400">git clone public_profile</span>
        <div className="absolute bottom-2.5 left-3.5 right-3.5 flex justify-between text-[8px] text-zinc-500 font-bold">
          <span>✓ Scanned</span>
          <span>✓ Synced</span>
        </div>
      </div>
    )
  },
  {
    number: "02",
    title: "Upload Resume",
    description: "Upload your resume in PDF format. Our parser runs an ATS keyword compliance test to spot structural weaknesses.",
    icon: FileText,
    color: "from-cyan-400 to-blue-500",
    glow: "shadow-cyan-500/10",
    visual: (
      <div className="flex flex-col items-center justify-center p-4 bg-zinc-950/60 rounded-2xl border border-white/5 w-full max-w-[220px] h-[125px] relative overflow-hidden">
        <FileText className="h-7 w-7 text-cyan-400 mb-2" />
        <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" 
            initial={{ width: 0 }}
            whileInView={{ width: "85%" }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
          />
        </div>
        <span className="text-[9px] font-bold text-cyan-400 mt-2.5">ATS scan complete</span>
      </div>
    )
  },
  {
    number: "03",
    title: "Analyze Skills",
    description: "DevLeveler cross-references your current technologies against industry benchmarks to map missing capabilities.",
    icon: Target,
    color: "from-indigo-500 to-purple-500",
    glow: "shadow-purple-500/10",
    visual: (
      <div className="flex flex-col items-center justify-center p-4 bg-zinc-950/60 rounded-2xl border border-white/5 w-full max-w-[220px] h-[125px] relative overflow-hidden">
        <div className="flex gap-1.5 flex-wrap justify-center">
          <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[8px] rounded-full font-bold">React</span>
          <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[8px] rounded-full font-bold">Node.js</span>
          <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[8px] rounded-full font-bold">SQL</span>
        </div>
        <div className="mt-2.5 flex items-center gap-1 text-[9px] font-bold text-amber-500">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
          Missing: Redis, Docker
        </div>
      </div>
    )
  },
  {
    number: "04",
    title: "Get Insights",
    description: "Receive your consolidated Developer Score, Career Readiness score, and a personalized 12-week roadmap.",
    icon: Compass,
    color: "from-emerald-400 to-teal-500",
    glow: "shadow-emerald-500/10",
    visual: (
      <div className="flex flex-col items-center justify-center p-4 bg-zinc-950/60 rounded-2xl border border-white/5 w-full max-w-[220px] h-[125px] relative overflow-hidden">
        <span className="text-2xl font-black text-emerald-400 tracking-tighter">84/100</span>
        <span className="text-[9px] font-bold text-zinc-500 mt-1 uppercase tracking-widest">Composite Rating</span>
        <span className="text-[8px] font-bold text-emerald-400 px-2 py-0.5 bg-emerald-950/20 border border-emerald-900/30 rounded-full mt-2">Roadmap Active</span>
      </div>
    )
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-28 bg-zinc-950 border-t border-white/5">
      {/* Background Blurs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-cyan-950/20 border border-cyan-800/30 px-3.5 py-1 text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
            Workflow
          </div>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl text-white">
            How DevLeveler Works
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed font-medium">
            Four structured steps to analyze your code, optimize your credentials, and accelerate your professional growth.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="relative mt-20 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Animated Timeline Connector Paths (Desktop) */}
          <div className="absolute top-[80px] left-[12%] right-[12%] h-[1.5px] bg-white/5 pointer-events-none hidden lg:block overflow-hidden">
            <motion.div 
              initial={{ left: "-100%" }}
              animate={{ left: "100%" }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 bottom-0 w-[150px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
            />
          </div>

          {STEPS.map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="flex flex-col items-center text-center relative group"
              id={`step-${idx + 1}`}
            >
              {/* Top Visual widget */}
              <div className="mb-6 w-full flex justify-center">
                <div className="relative transition-transform duration-300 group-hover:scale-[1.03]">
                  <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-purple-500/5 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {step.visual}
                </div>
              </div>

              {/* Step indicator circle */}
              <div className="relative flex items-center justify-center mb-4 z-10">
                <div className={`w-9.5 h-9.5 rounded-full bg-gradient-to-br ${step.color} p-0.5 flex items-center justify-center shadow-lg ${step.glow}`}>
                  <div className="w-full h-full bg-zinc-950 rounded-full flex items-center justify-center">
                    <step.icon className="h-4 w-4 text-white" />
                  </div>
                </div>
                <span className="absolute -right-8 font-black font-mono text-xs text-zinc-600 opacity-55">
                  {step.number}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-sm sm:text-base font-extrabold text-white mb-2">
                {step.title}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-[210px] font-medium">
                {step.description}
              </p>
            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}
