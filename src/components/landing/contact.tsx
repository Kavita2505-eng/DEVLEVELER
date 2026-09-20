"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Mail,
  Globe,
  Send,
  CheckCircle2,
  Loader2,
  AlertCircle
} from "lucide-react";
import { submitContactAction } from "@/actions/contact";

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

const CONTACT_LINKS = [
  {
    icon: Mail,
    label: "Email",
    value: "kartikshukla2301@gmail.com",
    href: "mailto:kartikshukla2301@gmail.com",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10"
  },
  {
    icon: GithubIcon,
    label: "GitHub",
    value: "kartikshukla2301-eng",
    href: "https://github.com/kartikshukla2301-eng",
    color: "text-zinc-300",
    bgColor: "bg-zinc-800/50"
  },
  {
    icon: LinkedinIcon,
    label: "LinkedIn",
    value: "in/kartik-shukla-cse",
    href: "https://www.linkedin.com/in/kartik-shukla-cse",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10"
  },
  {
    icon: Globe,
    label: "Portfolio",
    value: "kartik-portfolio-chi-eight.vercel.app",
    href: "https://kartik-portfolio-chi-eight.vercel.app",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10"
  }
];

export function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus("sending");
    setErrorMsg("");

    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("email", formData.email);
      fd.append("message", formData.message);
      fd.append("website", "");

      const result = await submitContactAction(fd);

      if (result.success) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
        setErrorMsg(result.error || "Failed to send message.");
        setTimeout(() => setStatus("idle"), 5000);
      }
    } catch {
      setStatus("error");
      setErrorMsg("An unexpected error occurred.");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <section id="contact" className="relative py-24 border-t border-[var(--border)]">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-500/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-[10px] font-bold text-[var(--accent)] uppercase tracking-wider">
            Contact
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl gradient-text">
            Get in Touch
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[var(--foreground-secondary)] leading-relaxed">
            Have questions about DevLeveler or want to collaborate? Reach out through any of 
            the profiles below or send a direct inquiry.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-10 lg:grid-cols-12 items-start">
          
          {/* Left Column: Direct Links */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-base font-bold text-white mb-6 uppercase tracking-wider">
              Developer Info
            </h3>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {CONTACT_LINKS.map((link, idx) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target={link.label !== "Email" ? "_blank" : undefined}
                  rel={link.label !== "Email" ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="card-base p-4 border-[var(--border)] bg-[var(--card)] hover:border-zinc-800 transition-all flex items-center gap-4 group"
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${link.bgColor} shrink-0 group-hover:scale-105 transition-transform`}>
                    <link.icon className={`h-5 w-5 ${link.color}`} />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-tertiary)] block">
                      {link.label}
                    </span>
                    <span className="text-xs sm:text-sm text-[var(--foreground-secondary)] group-hover:text-white transition-colors truncate block">
                      {link.value}
                    </span>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="card-base p-6 sm:p-8 border-[var(--border)] bg-[var(--card)]/60"
            >
              <h3 className="text-base font-bold text-white mb-6 uppercase tracking-wider">
                Send a Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot field — hidden from humans, bots will fill it */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label htmlFor="contact-name" className="text-[10px] font-bold uppercase text-[var(--foreground-tertiary)] tracking-wider">
                      Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name"
                      className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[var(--accent)] transition-colors"
                      disabled={status === "sending" || status === "success"}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="contact-email" className="text-[10px] font-bold uppercase text-[var(--foreground-tertiary)] tracking-wider">
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[var(--accent)] transition-colors"
                      disabled={status === "sending" || status === "success"}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-message" className="text-[10px] font-bold uppercase text-[var(--foreground-tertiary)] tracking-wider">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we help you?"
                    className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[var(--accent)] transition-colors resize-none"
                    disabled={status === "sending" || status === "success"}
                  />
                </div>

                <div className="pt-2">
                  {status === "error" && errorMsg ? (
                    <div className="flex items-center gap-2 text-xs font-semibold text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                      <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  ) : status === "success" ? (
                    <div className="flex items-center gap-2 text-xs font-semibold text-[var(--success)] bg-[var(--success-muted)] p-3 rounded-lg border border-[var(--success)]/20">
                      <CheckCircle2 className="h-4.5 w-4.5" />
                      <span>Thank you! Your message was sent successfully.</span>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="w-full sm:w-auto inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-6 text-xs font-semibold text-white transition-all hover:bg-[var(--accent-hover)] shadow-lg shadow-blue-500/10 disabled:opacity-50"
                    >
                      {status === "sending" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" />
                          Send Message
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
