"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUpAction } from "@/actions/auth";
import { Code2, ArrowLeft, Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Password rules checks
  const isMinLength = password.length >= 8;
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const matchesConfirm = password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all input fields.");
      return;
    }
    if (!isMinLength || !hasLetter || !hasNumber) {
      setError("Password does not meet validation strength rules.");
      return;
    }
    if (!matchesConfirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);

      const res = await signUpAction(formData);

      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError(res.error ?? "Registration failed. Try again.");
      }
    } catch {
      setError("An unexpected signup error occurred.");
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
          Create Account
        </h2>
        <p className="text-xs text-[var(--foreground-secondary)]">
          Join DevLeveler and accelerate your technical career.
        </p>
      </div>

      {success ? (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-center space-y-3">
          <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto animate-pulse" />
          <h3 className="text-sm font-bold text-white">Registration Successful!</h3>
          <p className="text-[11px] text-[var(--foreground-secondary)] leading-relaxed">
            Your account has been registered. Redirecting to the login screen...
          </p>
        </div>
      ) : (
        <>
          {/* Error display */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-[11px] text-red-400 font-medium">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-[var(--foreground-tertiary)] tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                placeholder="Alex Mercer"
                className="w-full h-10 px-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>

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

            <div>
              <label className="block text-[10px] uppercase font-bold text-[var(--foreground-tertiary)] tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                placeholder="Min 8 chars, letter & number"
                className="w-full h-10 px-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-[var(--foreground-tertiary)] tracking-wider mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                placeholder="Re-enter password"
                className="w-full h-10 px-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>

            {/* Live Password Checklist */}
            <div className="p-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[10px] space-y-1.5 font-medium">
              <span className="text-zinc-500 uppercase tracking-wide text-[9px] block">Password Requirements</span>
              <div className="flex items-center gap-1.5 text-zinc-400">
                {isMinLength ? <CheckCircle2 className="h-3.5 w-3.5 text-[var(--success)]" /> : <XCircle className="h-3.5 w-3.5 text-zinc-600" />}
                <span>At least 8 characters</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400">
                {hasLetter ? <CheckCircle2 className="h-3.5 w-3.5 text-[var(--success)]" /> : <XCircle className="h-3.5 w-3.5 text-zinc-600" />}
                <span>At least one letter (a-z)</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400">
                {hasNumber ? <CheckCircle2 className="h-3.5 w-3.5 text-[var(--success)]" /> : <XCircle className="h-3.5 w-3.5 text-zinc-600" />}
                <span>At least one number (0-9)</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400">
                {matchesConfirm ? <CheckCircle2 className="h-3.5 w-3.5 text-[var(--success)]" /> : <XCircle className="h-3.5 w-3.5 text-zinc-600" />}
                <span>Passwords match</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !isMinLength || !hasLetter || !hasNumber || !matchesConfirm}
              className="w-full h-10 rounded-lg bg-[var(--accent)] text-white text-xs font-semibold hover:bg-[var(--accent-hover)] transition-all flex items-center justify-center gap-2 disabled:opacity-40"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="text-center pt-2 text-xs text-[var(--foreground-secondary)] border-t border-[var(--border)]">
            Already have an account?{" "}
            <Link 
              href="/login" 
              className="font-bold text-[var(--accent)] hover:underline"
            >
              Sign In
            </Link>
          </div>

          {/* Back Link */}
          <div className="text-center pt-1">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-[var(--foreground-tertiary)] hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to home
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
