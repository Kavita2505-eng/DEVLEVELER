"use client";

import { useState } from "react";
import Link from "next/link";
import { LevelBadge } from "@/components/dashboard/level-badge";
import {
  Award,
  Users,
  TrendingUp,
  Search,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { LeaderboardEntry } from "@/actions/leaderboard";

interface RankingsClientProps {
  entries: LeaderboardEntry[];
  currentUser: {
    absoluteRank: number;
    percentile: number;
    totalUsers: number;
  } | null;
  currentUserId?: string;
}

export function RankingsClient({
  entries,
  currentUser,
  currentUserId,
}: RankingsClientProps) {
  const [search, setSearch] = useState("");

  const filteredEntries = entries.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      (e.username && e.username.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top statistics cards */}
      {currentUser && (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Position Card */}
          <div className="card-base p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground-tertiary)]">
                Global Ranking
              </span>
              <h3 className="text-2xl font-bold text-[var(--foreground)]">
                #{currentUser.absoluteRank}
              </h3>
              <p className="text-[10px] text-[var(--foreground-secondary)]">
                Out of {currentUser.totalUsers} registered users
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-muted)]/5 text-[var(--accent)] border border-[var(--border)]">
              <Award className="h-6 w-6" />
            </div>
          </div>

          {/* Percentile Card */}
          <div className="card-base p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground-tertiary)]">
                Developer Percentile
              </span>
              <h3 className="text-2xl font-bold text-emerald-400">
                Top {100 - currentUser.percentile}%
              </h3>
              <p className="text-[10px] text-[var(--foreground-secondary)]">
                Better than {currentUser.percentile}% of users
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>

          {/* Rank Tier Info */}
          <div className="card-base p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground-tertiary)]">
                Global Standing
              </span>
              <h3 className="text-2xl font-bold text-blue-400">
                Active Ladder
              </h3>
              <p className="text-[10px] text-[var(--foreground-secondary)]">
                Grow your score to claim Architect rank
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="card-base p-6 space-y-4">
        {/* Search header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[var(--border)] pb-4">
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Developer Standings</h3>
            <p className="text-[10px] text-[var(--foreground-secondary)]">Rankings sorted by developer XP levels</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--foreground-tertiary)]" />
            <input
              type="text"
              placeholder="Search developer name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] pl-9 pr-4 text-xs text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="text-[var(--foreground-tertiary)] border-b border-[var(--border)]">
                <th className="py-2.5 font-semibold w-12 text-center">Rank</th>
                <th className="py-2.5 font-semibold pl-4">Developer</th>
                <th className="py-2.5 font-semibold text-center w-24">Dev Score</th>
                <th className="py-2.5 font-semibold pl-4 w-40">Tier Title</th>
                <th className="py-2.5 font-semibold text-right pr-4 w-24">XP</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.length > 0 ? (
                filteredEntries.map((e) => {
                  const isSelf = e.userId === currentUserId;
                  const profileLink = e.username ? `/u/${e.username}` : null;
                  
                  return (
                    <tr
                      key={e.userId}
                      className={cn(
                        "border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface)] transition-colors",
                        isSelf ? "bg-[var(--accent-muted)]/5 font-semibold" : ""
                      )}
                    >
                      <td className="py-3 text-center text-[var(--foreground-secondary)] font-bold">
                        {e.absoluteRank}
                      </td>
                      <td className="py-3 pl-4">
                        <div className="flex items-center gap-2">
                          {e.image ? (
                            <Image
                              src={e.image}
                              alt={e.name}
                              width={24}
                              height={24}
                              unoptimized
                              className="h-6 w-6 rounded-full shrink-0 border border-[var(--border)]"
                            />
                          ) : (
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--surface)] border border-[var(--border)] text-[9px] font-bold text-[var(--foreground-secondary)] uppercase">
                              {e.name.substring(0, 2)}
                            </span>
                          )}
                          <div className="flex flex-col min-w-0">
                            <span className="text-[11px] text-[var(--foreground)] truncate font-semibold">
                              {e.name}
                            </span>
                            {profileLink ? (
                              <Link
                                href={profileLink}
                                className="text-[9px] text-[var(--accent)] hover:underline flex items-center gap-0.5 mt-0.5 font-medium min-w-0"
                              >
                                @{e.username} <ExternalLink className="h-2 w-2" />
                              </Link>
                            ) : (
                              <span className="text-[9px] text-[var(--foreground-tertiary)] mt-0.5">
                                Private Profile
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-center font-bold text-[var(--foreground-secondary)]">
                        {e.overallScore}
                      </td>
                      <td className="py-3 pl-4">
                        <LevelBadge level={e.level} />
                      </td>
                      <td className="py-3 text-right pr-4 font-mono font-bold text-[var(--foreground-secondary)]">
                        {e.xp.toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-xs text-[var(--foreground-tertiary)] italic">
                    No developers found matching search criteria.
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
