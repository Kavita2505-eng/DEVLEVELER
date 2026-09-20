"use client";

import { Shield, EyeOff, KeyRound, Eraser } from "lucide-react";
import { motion } from "motion/react";

const TRUST_ITEMS = [
  {
    icon: Shield,
    title: "Read-Only Scope",
    description: "DevLeveler only accesses public GitHub API endpoints. We never ask for read/write scope permissions on private repositories.",
  },
  {
    icon: EyeOff,
    title: "Data Confidentiality",
    description: "Your analyzed skills data is never sold to third-party databases. Recruiter matching directories are strictly opt-in.",
  },
  {
    icon: KeyRound,
    title: "Document Encryption",
    description: "Uploaded resumes are parsed securely using server-side handlers, and raw document payloads are heavily encrypted.",
  },
  {
    icon: Eraser,
    title: "1-Click Deletion",
    description: "You remain in complete control. Click 'Delete Profile' in your settings to instantly erase all parsed resume and repository records.",
  },
];

export function Trust() {
  return (
    <section id="trust" className="relative py-24 border-t border-[var(--border)] bg-[var(--background-secondary)]/10">
      <div className="relative mx-auto max-w-6xl px-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto animate-fade-in"
        >
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-bold text-[var(--success)] uppercase tracking-wider">
            Trust & Security
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl gradient-text">
            Security Built For Developers
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[var(--foreground-secondary)] leading-relaxed">
            Your career data is sensitive. We build under strict zero-trust guidelines to ensure 
            complete safety and control.
          </p>
        </motion.div>

        {/* Trust Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_ITEMS.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="card-base p-5 border-[var(--border)] bg-[var(--card)] hover:border-zinc-800 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent-muted)]">
                  <item.icon className="h-5 w-5 text-[var(--accent)]" />
                </div>
                <h3 className="text-sm font-bold text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-[var(--foreground-secondary)] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
