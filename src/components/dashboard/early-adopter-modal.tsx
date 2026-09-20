"use client";

import { useState, useEffect } from "react";
import { ArrowRight, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface EarlyAdopterModalProps {
  isEarlyAdopter: boolean;
}

export function EarlyAdopterModal({ isEarlyAdopter }: EarlyAdopterModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isEarlyAdopter) {
      const dismissed = localStorage.getItem("devleveler-early-adopter-dismissed");
      if (!dismissed) {
        const timer = setTimeout(() => setIsOpen(true), 600);
        return () => clearTimeout(timer);
      }
    }
  }, [isEarlyAdopter]);

  const handleClose = () => {
    localStorage.setItem("devleveler-early-adopter-dismissed", "true");
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Subtle light translucent backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-slate-900/25 backdrop-blur-xs transition-all"
          />

          {/* Light-First Precision Intelligence Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-md bg-white border border-outline-variant/60 rounded-2xl p-6 sm:p-8 shadow-xl overflow-hidden z-10"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1 rounded-lg text-outline hover:bg-surface-container-low hover:text-on-surface transition-colors"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative space-y-5 text-center">
              {/* Badge Icon */}
              <div className="mx-auto flex h-13 w-13 items-center justify-center rounded-2xl bg-primary-fixed text-primary">
                <Sparkles className="h-6 w-6" />
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-mono text-[11px] font-bold uppercase tracking-wider">
                  Founding Developer Active
                </span>
                <h3 className="text-xl font-bold tracking-tight text-on-surface font-headline pt-1">
                  Welcome to DevLeveler Pro
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed pt-1">
                  You are one of the first 5 Founding Developers on DevLeveler.
                </p>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  You have unlocked <span className="font-bold text-primary">DevLeveler Pro Tier</span> completely free for 6 months.
                </p>
                <p className="text-[11px] text-outline leading-relaxed pt-1 font-mono">
                  Full AI diagnostics • Custom roadmaps • Unlimited AST audits
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={handleClose}
                className="w-full inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary-container px-6 text-xs font-semibold text-white transition-all hover:opacity-95 shadow-xs cursor-pointer"
              >
                <span>Access Workspace</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
