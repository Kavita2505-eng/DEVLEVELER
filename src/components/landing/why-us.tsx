"use client";

import { XCircle, CheckCircle2, ShieldAlert, Award, Compass } from "lucide-react";
import { motion } from "motion/react";

const COMPARISONS = [
  {
    icon: ShieldAlert,
    title: "ATS Resume Rejections",
    problem: "Applying to dozens of roles with a resume that fails basic automated parser keyword tests.",
    solution: "Interactive ATS resume optimizer checks keyword densities and formats files for maximum parser success.",
    color: "from-blue-500/20 to-cyan-500/5",
  },
  {
    icon: Compass,
    title: "Directionless Learning Pathing",
    problem: "Attempting to learn every framework and getting overwhelmed by unstructured documentation.",
    solution: "Weekly and monthly milestones focus on learning high-priority missing technologies for target roles.",
    color: "from-purple-500/20 to-pink-500/5",
  },
  {
    icon: Award,
    title: "Blind Spots in Portfolios",
    problem: "Deploying developer portfolios with slow load times, broken links, or design layouts that turn off recruiters.",
    solution: "Telemetry audits scan portfolio load speeds, accessibility, and code density to calculate design grades.",
    color: "from-emerald-500/20 to-teal-500/5",
  },
  {
    icon: XCircle,
    title: "Market Readiness Unknowns",
    problem: "Entering applications blindly without knowing if you match startup agility or enterprise scale standards.",
    solution: "Composite indicators evaluate coding style, repository structures, and resume depth to measure compatibility.",
    color: "from-pink-500/20 to-violet-500/5",
  },
];

export function WhyUs() {
  return (
    <section id="why-us" className="relative py-28 border-t border-white/5 bg-zinc-950">
      
      {/* Background blurs */}
      <div className="absolute top-10 right-10 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-6 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-950/20 border border-purple-800/30 px-3.5 py-1 text-[10px] font-bold text-purple-400 uppercase tracking-widest">
            Problems & Solutions
          </div>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl text-white">
            Why Use DevLeveler?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed font-medium">
            Advancing as a software engineer shouldn&apos;t rely on guesswork. We solve the blind spots that prevent developers from advancing their tech careers.
          </p>
        </motion.div>

        {/* Comparisons Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {COMPARISONS.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="premium-glass-card rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header Icon + Title */}
                <div className="flex items-center gap-3.5 pb-4 border-b border-white/5 mb-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 shadow-lg">
                    <item.icon className="h-5 w-5 text-cyan-400" />
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white">
                    {item.title}
                  </h3>
                </div>

                {/* Problem vs Solution */}
                <div className="grid gap-5">
                  <div className="flex gap-3 items-start text-xs text-zinc-400 p-3 bg-red-950/5 border border-red-900/10 rounded-xl">
                    <XCircle className="h-4.5 w-4.5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold text-zinc-500 uppercase text-[9px] tracking-widest block mb-1">The Struggle</span>
                      <p className="leading-relaxed font-medium">{item.problem}</p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start text-xs text-zinc-300 p-3 bg-cyan-950/5 border border-cyan-900/10 rounded-xl">
                    <CheckCircle2 className="h-4.5 w-4.5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold text-cyan-400 uppercase text-[9px] tracking-widest block mb-1">The DevLeveler Edge</span>
                      <p className="leading-relaxed font-semibold">{item.solution}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
