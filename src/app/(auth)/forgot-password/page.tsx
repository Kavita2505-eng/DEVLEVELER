"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPasswordAction } from "@/actions/auth";
import { Code2, ArrowLeft, Loader2, ExternalLink } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [localResetLink, setLocalResetLink] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);
    setMessage(null);
    setLocalResetLink(null);

    try {
      const res = await forgotPasswordAction(email);
      if (res.success) {
        setMessage(res.message ?? "Password reset link generated.");
        if (res.resetLink) {
          setLocalResetLink(res.resetLink);
        }
      } else {
        setError(res.error ?? "Failed to initiate password reset.");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-base p-8 w-full max-w-[400px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-2xl shadow-2xl space-y-6">
      
      {/* Branding */}
      <div className="flex flex-col items-center gap-2 text-center">
        <Link 
          href="/" 
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
        >
          <Code2 className="h-5.5 w-5.5" />
        </Link>
        <h2 className="text-xl font-bold text-white mt-2">
          Reset Password
        </h2>
        <p className="text-xs text-[var(--foreground-secondary)]">
          Enter your email address to receive a password reset token.
        </p>
      </div>

      {/* Error / Success blocks */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-[11px] text-red-400 font-medium">
          {error}
        </div>
      )}

      {message && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[11px] text-emerald-400 font-medium">
          {message}
        </div>
      )}

      {/* Local Sandbox Testing Link Display */}
      {localResetLink && (
        <div className="p-3.5 bg-blue-500/10 border border-blue-500/20 rounded-lg space-y-2 text-xs">
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
            Sandbox Testing Tool
          </span>
          <p className="text-[10px] text-zinc-300 leading-normal">
            For local convenience, click the link below to load the password reset screen:
          </p>
          <Link
            href={localResetLink}
            className="inline-flex items-center gap-1.5 font-bold text-white bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded text-[10px] transition-colors"
          >
            Reset My Password
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      )}

      {!message && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase font-bold text-[var(--foreground-tertiary)] tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              placeholder="dev@example.com"
              className="w-full h-10 px-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full h-10 rounded-lg bg-[var(--accent)] text-white text-xs font-semibold hover:bg-[var(--accent-hover)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>
      )}

      {/* Footer links */}
      <div className="text-center pt-2 text-xs text-[var(--foreground-secondary)] border-t border-[var(--border)]">
        Remember your password?{" "}
        <Link 
          href="/login" 
          className="font-bold text-[var(--accent)] hover:underline"
        >
          Sign In
        </Link>
      </div>

      <div className="text-center pt-1">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-[var(--foreground-tertiary)] hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </Link>
      </div>

    </div>
  );
}
