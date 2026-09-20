"use client";

import { useState } from "react";
import { updateUserRoleOrPlanAction } from "@/actions/admin";
import type { AdminStats } from "@/actions/admin";
import {
  Users,
  Activity,
  ScanEye,
  TrendingUp,
  Search,
  CheckCircle2,
  Loader2,
  Flame,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface AdminClientProps {
  initialStats: AdminStats;
}

export function AdminClient({ initialStats }: AdminClientProps) {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats>(initialStats);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleUpdateUser = async (
    userId: string,
    role: "DEVELOPER" | "RECRUITER" | "ADMIN",
    plan: "FREE" | "PRO"
  ) => {
    setUpdatingUserId(userId);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const res = await updateUserRoleOrPlanAction(userId, role, plan);
      if (res.success) {
        setSuccessMessage("User credentials updated successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
        // Update local state
        setStats((prev) => ({
          ...prev,
          users: prev.users.map((u) =>
            u.id === userId ? { ...u, role, plan } : u
          ),
        }));
        router.refresh();
      } else {
        setErrorMessage(res.error ?? "Failed to update user configurations.");
      }
    } catch {
      setErrorMessage("An unexpected error occurred.");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const filteredUsers = stats.users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Messages */}
      {successMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="rounded-lg border border-[var(--error-border)] bg-[var(--error-bg)] p-4 text-xs text-[var(--error)]">
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}
        <div className="card-base p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-semibold text-[var(--foreground-tertiary)] uppercase tracking-wider">Total Users</span>
            <p className="text-2xl font-bold text-[var(--foreground)]">{stats.totalUsers}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground-secondary)]">
            <Users className="h-5 w-5" />
          </div>
        </div>

        {/* Active Users */}
        <div className="card-base p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-semibold text-[var(--foreground-tertiary)] uppercase tracking-wider">Active Users (30d)</span>
            <p className="text-2xl font-bold text-[var(--foreground)]">{stats.activeUsers}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Activity className="h-5 w-5" />
          </div>
        </div>

        {/* Total Scans */}
        <div className="card-base p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-semibold text-[var(--foreground-tertiary)] uppercase tracking-wider">Analyses Performed</span>
            <p className="text-2xl font-bold text-[var(--foreground)]">{stats.totalScans}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <ScanEye className="h-5 w-5" />
          </div>
        </div>

        {/* Growth */}
        <div className="card-base p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-semibold text-[var(--foreground-tertiary)] uppercase tracking-wider">Monthly Growth</span>
            <p className="text-2xl font-bold text-[var(--foreground)]">+{stats.monthlyGrowth}%</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Early Adopter Program Status Section */}
      <div className="card-base p-5 border-rose-500/20 bg-rose-500/[0.01] relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 shrink-0 text-rose-400 border border-rose-500/20">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase tracking-wider text-rose-400">
                Early Adopter Program Status
              </span>
              <span className={cn(
                "rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border",
                stats.claimedSpots >= 10
                  ? "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                  : "bg-red-500/10 text-red-400 border-red-500/20 animate-pulse"
              )}>
                {stats.claimedSpots >= 10 ? "Closed / Full" : "Active / Open"}
              </span>
            </div>
            <p className="text-[11px] text-[var(--foreground-secondary)] mt-1 leading-normal">
              Dynamically monitoring the strict 10-user limit on free 6-month Pro access.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 w-full md:w-auto border-t border-[var(--border)]/35 md:border-0 pt-4 md:pt-0">
          <div className="bg-[var(--surface)] border border-[var(--border)] px-4 py-2 rounded-xl text-center md:text-left min-w-[100px]">
            <span className="text-[9px] uppercase font-bold text-[var(--foreground-tertiary)] tracking-wider block">Claimed Spots</span>
            <span className="text-sm font-bold text-white">{stats.claimedSpots} / 10</span>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--border)] px-4 py-2 rounded-xl text-center md:text-left min-w-[100px]">
            <span className="text-[9px] uppercase font-bold text-[var(--foreground-tertiary)] tracking-wider block">Remaining Slots</span>
            <span className="text-sm font-bold text-rose-400">{stats.remainingSpots}</span>
          </div>
        </div>
      </div>

      {/* User Management Section */}
      <div className="card-base p-6 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--border)] pb-4">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">User Management Directory</h3>
          
          {/* User search query */}
          <div className="relative w-full max-w-xs">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--foreground-tertiary)]" />
            <input
              type="text"
              placeholder="Search users by name, email, user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] pl-9 pr-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-tertiary)]">
                <th className="py-3 pl-4">Developer</th>
                <th className="py-3">Role / Plan Configuration</th>
                <th className="py-3">Subscription Status</th>
                <th className="py-3">Subscription Dates</th>
                <th className="py-3">Days Left</th>
                <th className="py-3 pr-4 text-right">Alert Warning Flags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] text-xs text-[var(--foreground-secondary)]">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => {
                  const subStatus = (() => {
                    if (u.plan !== "PRO") return "FREE";
                    if (!u.premiumExpiresAt) return "ACTIVE";
                    const expiry = new Date(u.premiumExpiresAt).getTime();
                    const now = Date.now();
                    if (expiry < now) return "EXPIRED";
                    const remainingDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
                    if (remainingDays <= 30) return "EXPIRING SOON";
                    return "ACTIVE";
                  })();

                  const remainingDaysVal = (() => {
                    if (u.plan !== "PRO" || !u.premiumExpiresAt) return null;
                    const expiry = new Date(u.premiumExpiresAt).getTime();
                    const now = Date.now();
                    if (expiry < now) return 0;
                    return Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
                  })();

                  const remainingDaysText = (() => {
                    if (u.plan !== "PRO") return "N/A";
                    if (!u.premiumExpiresAt) return "Lifetime";
                    if (remainingDaysVal === 0) return "Expired";
                    return `${remainingDaysVal} days`;
                  })();

                  const alertFlag = (() => {
                    if (remainingDaysVal === null) return null;
                    if (remainingDaysVal <= 0) return null; // already expired
                    if (remainingDaysVal <= 1) return { label: "1d Final Reminder", color: "bg-red-500/10 text-red-400 border-red-500/20" };
                    if (remainingDaysVal <= 7) return { label: "7d Priority Alert", color: "bg-rose-500/10 text-rose-400 border-rose-500/20" };
                    if (remainingDaysVal <= 14) return { label: "14d Strong Warning", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" };
                    if (remainingDaysVal <= 30) return { label: "30d Expiry Warning", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" };
                    return null;
                  })();

                  const formatDate = (date: Date | string | null) => {
                    if (!date) return "N/A";
                    return new Date(date).toISOString().split("T")[0];
                  };

                  return (
                    <tr key={u.id} className="hover:bg-[var(--surface)]/30 transition-colors">
                      {/* User profile */}
                      <td className="py-3 pl-4">
                        <div>
                          <span className="font-semibold text-[var(--foreground)]">{u.name || "Anonymous"}</span>
                          {u.username && (
                            <span className="block text-[10px] text-[var(--foreground-tertiary)] font-normal">@{u.username}</span>
                          )}
                          <span className="block text-[9px] text-[var(--foreground-tertiary)] font-mono">{u.email}</span>
                        </div>
                      </td>
                      {/* Controls select */}
                      <td className="py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <select
                            disabled={updatingUserId === u.id}
                            value={u.role}
                            onChange={(e) =>
                              handleUpdateUser(
                                u.id,
                                e.target.value as "DEVELOPER" | "RECRUITER" | "ADMIN",
                                u.plan as "FREE" | "PRO"
                              )
                            }
                            className="h-8 rounded border border-[var(--border)] bg-[var(--surface)] px-1.5 text-[11px] text-[var(--foreground)] outline-none focus:border-[var(--accent)] cursor-pointer"
                          >
                            <option value="DEVELOPER">Developer</option>
                            <option value="RECRUITER">Recruiter</option>
                            <option value="ADMIN">Admin</option>
                          </select>

                          <div className="flex items-center gap-1.5">
                            {updatingUserId === u.id && <Loader2 className="h-3 w-3 animate-spin text-[var(--accent)]" />}
                            <select
                              disabled={updatingUserId === u.id}
                              value={u.plan}
                              onChange={(e) =>
                                handleUpdateUser(
                                  u.id,
                                  u.role as "DEVELOPER" | "RECRUITER" | "ADMIN",
                                  e.target.value as "FREE" | "PRO"
                                )
                              }
                              className="h-8 rounded border border-[var(--border)] bg-[var(--surface)] px-1.5 text-[11px] text-[var(--foreground)] outline-none focus:border-[var(--accent)] cursor-pointer"
                            >
                              <option value="FREE">Free Tier</option>
                              <option value="PRO">Pro Tier</option>
                            </select>
                          </div>
                        </div>
                      </td>
                      {/* Subscription status */}
                      <td className="py-3">
                        {subStatus === "FREE" && (
                          <span className="inline-flex items-center rounded bg-zinc-500/10 px-2 py-0.5 text-[10px] font-semibold text-zinc-400 border border-zinc-500/20">
                            FREE
                          </span>
                        )}
                        {subStatus === "ACTIVE" && (
                          <span className="inline-flex items-center rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                            ACTIVE
                          </span>
                        )}
                        {subStatus === "EXPIRING SOON" && (
                          <span className="inline-flex items-center rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400 border border-amber-500/20 animate-pulse">
                            EXPIRING SOON
                          </span>
                        )}
                        {subStatus === "EXPIRED" && (
                          <span className="inline-flex items-center rounded bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-400 border border-red-500/20">
                            EXPIRED
                          </span>
                        )}
                      </td>
                      {/* Dates */}
                      <td className="py-3 font-mono text-[10px] text-[var(--foreground-secondary)]">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] text-[var(--foreground-tertiary)] uppercase font-semibold w-10">Start:</span>
                            <span>{formatDate(u.premiumStartedAt)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] text-[var(--foreground-tertiary)] uppercase font-semibold w-10">Expiry:</span>
                            <span>{formatDate(u.premiumExpiresAt)}</span>
                          </div>
                        </div>
                      </td>
                      {/* Days Left */}
                      <td className="py-3 font-mono">
                        <span className={cn(
                          "font-semibold",
                          remainingDaysVal === null
                            ? "text-[var(--foreground-tertiary)]"
                            : remainingDaysVal === 0
                            ? "text-red-400"
                            : remainingDaysVal <= 7
                            ? "text-rose-400"
                            : remainingDaysVal <= 30
                            ? "text-amber-400"
                            : "text-emerald-400"
                        )}>
                          {remainingDaysText}
                        </span>
                      </td>
                      {/* Alert warning flags */}
                      <td className="py-3 pr-4 text-right">
                        {alertFlag ? (
                          <span className={cn("inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider", alertFlag.color)}>
                            <AlertTriangle className="h-3 w-3 shrink-0" />
                            {alertFlag.label}
                          </span>
                        ) : u.plan === "PRO" && subStatus === "ACTIVE" ? (
                          <span className="inline-flex items-center gap-1 text-[9px] text-emerald-400 font-semibold">
                            <CheckCircle2 className="h-3 w-3" /> Secure
                          </span>
                        ) : (
                          <span className="text-zinc-600 font-mono text-[10px]">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-[var(--foreground-tertiary)] italic">
                    No users found matching search query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
