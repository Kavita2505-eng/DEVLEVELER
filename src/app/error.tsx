"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] p-6">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20">
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold text-[var(--foreground)]">
            Something went wrong
          </h1>
          <p className="text-sm text-[var(--foreground-secondary)] leading-relaxed">
            An unexpected error occurred. Please try again or return to the home page.
          </p>
          {error.digest && (
            <p className="text-xs text-[var(--foreground-tertiary)] font-mono">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-5 text-xs font-semibold text-white transition-all hover:bg-[var(--accent-hover)] shadow-lg shadow-blue-500/10"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-5 text-xs font-semibold text-[var(--foreground-secondary)] transition-all hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
          >
            <Home className="h-3.5 w-3.5" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
