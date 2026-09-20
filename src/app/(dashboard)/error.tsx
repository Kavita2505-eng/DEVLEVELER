"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20">
            <AlertTriangle className="h-7 w-7 text-red-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-bold text-[var(--foreground)]">
            Dashboard Error
          </h2>
          <p className="text-sm text-[var(--foreground-secondary)] leading-relaxed">
            Something went wrong while loading this section. Please try again.
          </p>
          {error.digest && (
            <p className="text-xs text-[var(--foreground-tertiary)] font-mono">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <button
          onClick={reset}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-5 text-xs font-semibold text-white transition-all hover:bg-[var(--accent-hover)] shadow-lg shadow-blue-500/10"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Try Again
        </button>
      </div>
    </div>
  );
}
