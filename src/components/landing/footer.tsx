"use client";

import Link from "next/link";
import { 
  Code2, 
  Globe, 
  Mail 
} from "lucide-react";

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

export function Footer() {
  return (
    <footer className="relative border-t border-[var(--border)] py-12 bg-[var(--background)] overflow-hidden">
      {/* Subtle aurora glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-gradient-to-t from-blue-500/5 via-purple-500/3 to-transparent rounded-full blur-[80px] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-6 relative z-10">
        <div className="grid gap-8 md:grid-cols-4">
          
          {/* Logo & Tagline */}
          <div className="space-y-4">
            <Link
              href="/"
              id="footer-logo"
              className="flex items-center gap-2 text-[var(--foreground)]"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-secondary)] text-white">
                <Code2 className="h-4 w-4" />
              </div>
              <span className="text-base font-semibold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                DevLeveler
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-[var(--foreground-tertiary)] max-w-xs">
              AI-powered developer intelligence platform. Know your level, find gaps, and map your growth.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]">
              Product
            </h4>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href="#about"
                  className="text-xs text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors"
                >
                  About Platform
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-xs text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-xs text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors"
                >
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]">
              Resources
            </h4>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href="https://github.com/kartikshukla2301-eng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors"
                >
                  GitHub Profile
                </a>
              </li>
              <li>
                <a
                  href="https://kartik-portfolio-chi-eight.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors"
                >
                  Developer Portfolio
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/kartik-shukla-cse"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors"
                >
                  LinkedIn Directory
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]">
              Company
            </h4>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href="#trust"
                  className="text-xs text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors"
                >
                  Trust & Security
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-xs text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors"
                >
                  Contact Info
                </a>
              </li>
              <li>
                <a
                  href="mailto:kartikshukla2301@gmail.com"
                  className="text-xs text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors"
                >
                  Email Developer
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--border)] pt-8 sm:flex-row">
          <p className="text-xs text-[var(--foreground-tertiary)]">
            &copy; {new Date().getFullYear()} DevLeveler. Built with precision.
          </p>
          <div className="flex gap-4">
            <a
              href="https://github.com/kartikshukla2301-eng"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--foreground-tertiary)] hover:text-[var(--foreground)] transition-colors"
              aria-label="GitHub"
            >
              <GithubIcon className="h-4.5 w-4.5" />
            </a>
            <a
              href="https://www.linkedin.com/in/kartik-shukla-cse"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--foreground-tertiary)] hover:text-[var(--foreground)] transition-colors"
              aria-label="LinkedIn"
            >
              <LinkedinIcon className="h-4.5 w-4.5" />
            </a>
            <a
              href="https://kartik-portfolio-chi-eight.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--foreground-tertiary)] hover:text-[var(--foreground)] transition-colors"
              aria-label="Portfolio"
            >
              <Globe className="h-4.5 w-4.5" />
            </a>
            <a
              href="mailto:kartikshukla2301@gmail.com"
              className="text-[var(--foreground-tertiary)] hover:text-[var(--foreground)] transition-colors"
              aria-label="Email"
            >
              <Mail className="h-4.5 w-4.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
