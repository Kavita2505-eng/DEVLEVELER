"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, RefreshCw, Loader2 } from "lucide-react";

interface AIErrorBoundaryProps {
  children: React.ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  onRetry?: () => void;
}

export function AIErrorBoundary({
  children,
  fallbackTitle = "AI Analysis Failed",
  fallbackMessage = "The AI service encountered an error. Please try again in a moment.",
  onRetry,
}: AIErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      // Only catch AI-related errors
      if (
        event.message?.includes("AI") ||
        event.message?.includes("Gemini") ||
        event.message?.includes("parse")
      ) {
        setHasError(true);
        event.preventDefault();
      }
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  const handleRetry = async () => {
    setIsRetrying(true);
    setHasError(false);

    if (onRetry) {
      await onRetry();
    }

    // Brief delay for UX feedback
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsRetrying(false);
  };

  if (hasError) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center p-6">
        <div className="w-full max-w-md text-center space-y-5">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-[var(--foreground)]">
              {fallbackTitle}
            </h3>
            <p className="text-xs text-[var(--foreground-secondary)] leading-relaxed">
              {fallbackMessage}
            </p>
          </div>

          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-4 text-xs font-semibold text-white transition-all hover:bg-[var(--accent-hover)] disabled:opacity-50"
          >
            {isRetrying ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="h-3.5 w-3.5" />
                Try Again
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Inline error display for AI operations (not a boundary, just a component).
 */
export function AIErrorDisplay({
  error,
  onRetry,
  className = "",
}: {
  error: string | null;
  onRetry?: () => void;
  className?: string;
}) {
  if (!error) return null;

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 ${className}`}>
      <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-red-400">Error</p>
        <p className="text-xs text-[var(--foreground-secondary)] mt-0.5">{error}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="shrink-0 inline-flex h-7 items-center justify-center gap-1.5 rounded bg-red-500/20 px-2.5 text-[10px] font-semibold text-red-400 hover:bg-red-500/30 transition-colors"
        >
          <RefreshCw className="h-3 w-3" />
          Retry
        </button>
      )}
    </div>
  );
}
