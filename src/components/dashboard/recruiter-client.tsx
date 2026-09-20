"use client";

import { useState, useEffect } from "react";
import { searchDevelopersAction } from "@/actions/recruiter";
import type { CandidateProfile } from "@/actions/recruiter";
import {
  Search,
  Filter,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ExternalLink,
  Award,
  Briefcase,
  Code2,
  X,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface RecruiterClientProps {
  initialTrendingSkills: string[];
}

export function RecruiterClient({ initialTrendingSkills }: RecruiterClientProps) {
  const [candidates, setCandidates] = useState<CandidateProfile[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [query, setQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [level, setLevel] = useState("");
  const [minDevScore, setMinDevScore] = useState(0);
  const maxDevScore = 100;
  const [minReadinessScore, setMinReadinessScore] = useState(0);
  const maxReadinessScore = 100;

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 6;

  // Selected candidate overlay modal
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateProfile | null>(null);

  const fetchCandidates = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await searchDevelopersAction({
        query,
        skills: selectedSkills,
        minDevScore,
        maxDevScore,
        minReadinessScore,
        maxReadinessScore,
        level,
        page,
        limit,
      });

      if (res.success && res.data) {
        setCandidates(res.data.candidates);
        setTotalCount(res.data.totalCount);
      } else {
        setError(res.error ?? "Failed to fetch candidates.");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [selectedSkills, level, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchCandidates();
  };

  const handleAddSkill = (skill: string) => {
    const cleanSkill = skill.trim();
    if (cleanSkill && !selectedSkills.some((s) => s.toLowerCase() === cleanSkill.toLowerCase())) {
      setSelectedSkills((prev) => [...prev, cleanSkill]);
      setNewSkill("");
      setPage(1);
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSelectedSkills((prev) => prev.filter((s) => s !== skill));
    setPage(1);
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--foreground-tertiary)]" />
          <input
            type="text"
            placeholder="Search candidates by name, username, or keywords..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-10 rounded-lg border border-[var(--border)] bg-[var(--surface)] pl-10 pr-4 text-xs text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>
        <button
          type="submit"
          className="h-10 px-5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-xs font-semibold text-white transition-colors cursor-pointer"
        >
          Search
        </button>
      </form>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Column: Filters */}
        <div className="lg:col-span-4 card-base p-5 space-y-5">
          <h3 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider flex items-center gap-1.5 border-b border-[var(--border)] pb-2.5">
            <Filter className="h-4 w-4" /> Filter Options
          </h3>

          {/* Level filter */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-[var(--foreground-secondary)]">Developer Level</label>
            <select
              value={level}
              onChange={(e) => {
                setLevel(e.target.value);
                setPage(1);
              }}
              className="w-full h-8.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
            >
              <option value="">All Experience Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Explorer">Explorer</option>
              <option value="Builder">Builder</option>
              <option value="Engineer">Engineer</option>
              <option value="Architect">Architect</option>
              <option value="Master">Master</option>
            </select>
          </div>

          {/* Skills Filter */}
          <div className="space-y-2">
            <label className="text-[10px] font-semibold text-[var(--foreground-secondary)]">Required Skills</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add skill (e.g. React)..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill(newSkill))}
                className="flex-1 h-8.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
              />
              <button
                type="button"
                onClick={() => handleAddSkill(newSkill)}
                className="h-8.5 px-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--foreground-secondary)] hover:text-[var(--foreground)]"
              >
                Add
              </button>
            </div>

            {/* Selected Skills */}
            {selectedSkills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedSkills.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 rounded bg-[var(--surface)] border border-[var(--border)] pl-2 pr-1.5 py-0.5 text-[10px] font-semibold text-[var(--foreground-secondary)]"
                  >
                    {s}
                    <button type="button" onClick={() => handleRemoveSkill(s)} className="text-[var(--foreground-tertiary)] hover:text-white">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Trending / Common Skills */}
            <div className="space-y-1">
              <span className="text-[9px] text-[var(--foreground-tertiary)] block">Trending Tags:</span>
              <div className="flex flex-wrap gap-1">
                {initialTrendingSkills.map((ts) => (
                  <button
                    key={ts}
                    type="button"
                    onClick={() => handleAddSkill(ts)}
                    className="rounded-full bg-[var(--surface)] border border-[var(--border)] px-2 py-0.5 text-[9px] text-[var(--foreground-tertiary)] hover:text-white transition-colors"
                  >
                    +{ts}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <hr className="border-[var(--border)]" />

          {/* Dev Score Range */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px]">
              <span className="font-semibold text-[var(--foreground-secondary)]">Min Developer Score</span>
              <span className="font-mono text-[var(--accent)] font-bold">{minDevScore}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={minDevScore}
              onChange={(e) => setMinDevScore(Number(e.target.value))}
              className="w-full accent-[var(--accent)] bg-[var(--surface)] h-1 rounded"
            />
          </div>

          {/* Career Readiness Score Range */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px]">
              <span className="font-semibold text-[var(--foreground-secondary)]">Min Career Readiness</span>
              <span className="font-mono text-emerald-400 font-bold">{minReadinessScore}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={minReadinessScore}
              onChange={(e) => setMinReadinessScore(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-[var(--surface)] h-1 rounded"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setPage(1);
              fetchCandidates();
            }}
            className="w-full h-8.5 rounded-lg border border-[var(--border)] hover:bg-[var(--surface)] text-xs font-semibold text-[var(--foreground)] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" /> Apply Filters
          </button>
        </div>

        {/* Right Column: Candidates Lists */}
        <div className="lg:col-span-8 space-y-6">
          {error && (
            <div className="rounded-lg border border-[var(--error-border)] bg-[var(--error-bg)] p-4 text-xs text-[var(--error)]">
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-[var(--accent)]" />
            </div>
          ) : candidates.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {candidates.map((c) => (
                <div key={c.id} className="card-base p-5 flex flex-col justify-between hover:border-[var(--border-hover)] transition-colors">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                      {c.image ? (
                        <Image src={c.image} alt={c.name ?? ""} width={40} height={40} unoptimized className="h-10 w-10 rounded-full border border-[var(--border)] object-cover" />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground-secondary)] font-bold uppercase text-xs">
                          {(c.name || "DE").substring(0, 2)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-[var(--foreground)] truncate">{c.name || "Anonymous"}</h4>
                        <span className="text-[10px] text-[var(--foreground-tertiary)] block">@{c.username || "dev"}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-[var(--foreground-secondary)] leading-relaxed line-clamp-2 min-h-[34px]">
                      {c.bio || "No summary bio specified."}
                    </p>

                    {/* Scores row */}
                    <div className="flex gap-4">
                      {c.devScore && (
                        <div className="flex items-center gap-1.5">
                          <Award className="h-3.5 w-3.5 text-[var(--accent)]" />
                          <div className="text-[10px]">
                            <span className="block text-[8px] text-[var(--foreground-tertiary)] leading-none uppercase">Score</span>
                            <span className="font-bold text-[var(--foreground)] font-mono">{Math.round(c.devScore.overallScore)}</span>
                          </div>
                        </div>
                      )}

                      {c.readinessScore !== null && (
                        <div className="flex items-center gap-1.5">
                          <Briefcase className="h-3.5 w-3.5 text-emerald-400" />
                          <div className="text-[10px]">
                            <span className="block text-[8px] text-[var(--foreground-tertiary)] leading-none uppercase">Readiness</span>
                            <span className="font-bold text-[var(--foreground)] font-mono">{Math.round(c.readinessScore)}%</span>
                          </div>
                        </div>
                      )}

                      {c.githubProfile && (
                        <div className="flex items-center gap-1.5">
                          <Code2 className="h-3.5 w-3.5 text-blue-400" />
                          <div className="text-[10px]">
                            <span className="block text-[8px] text-[var(--foreground-tertiary)] leading-none uppercase">Stars</span>
                            <span className="font-bold text-[var(--foreground)] font-mono">{c.githubProfile.totalStars}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Skills badge preview */}
                    <div className="flex flex-wrap gap-1 overflow-hidden max-h-[48px]">
                      {c.skills.slice(0, 5).map((s) => (
                        <span
                          key={s}
                          className="rounded bg-[var(--surface)] px-2 py-0.5 text-[9px] font-semibold text-[var(--foreground-secondary)] border border-[var(--border)]"
                        >
                          {s}
                        </span>
                      ))}
                      {c.skills.length > 5 && (
                        <span className="text-[9px] text-[var(--foreground-tertiary)] font-bold pl-1 pt-0.5">
                          +{c.skills.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedCandidate(c)}
                    className="w-full mt-4 h-8 rounded-lg bg-[var(--surface)] hover:bg-[var(--border)] border border-[var(--border)] text-xs font-semibold text-[var(--foreground)] transition-colors cursor-pointer"
                  >
                    View capability sheet
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="card-base p-12 text-center text-xs text-[var(--foreground-tertiary)] italic">
              No developer candidates found matching your criteria. Try adjusting the skill tags or score ranges.
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
              <span className="text-[10px] text-[var(--foreground-tertiary)]">
                Showing candidate {(page - 1) * limit + 1} - {Math.min(page * limit, totalCount)} of {totalCount}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="h-8 w-8 rounded-lg border border-[var(--border)] flex items-center justify-center text-[var(--foreground-secondary)] hover:text-white disabled:opacity-50 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="h-8 w-8 rounded-lg border border-[var(--border)] flex items-center justify-center text-[var(--foreground-secondary)] hover:text-white disabled:opacity-50 transition-colors cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Candidate Modal Overlay */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedCandidate(null)}
              className="absolute top-4 right-4 h-8 w-8 rounded-lg border border-[var(--border)] text-[var(--foreground-secondary)] hover:text-white flex items-center justify-center hover:bg-[var(--surface)] transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Candidate Header */}
            <div className="flex items-center gap-4 border-b border-[var(--border)] pb-4">
              {selectedCandidate.image ? (
                <Image src={selectedCandidate.image} alt={selectedCandidate.name ?? ""} width={64} height={64} unoptimized className="h-16 w-16 rounded-full border border-[var(--border)] object-cover" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground-secondary)] font-bold uppercase text-lg">
                  {(selectedCandidate.name || "DE").substring(0, 2)}
                </div>
              )}
              <div>
                <h3 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
                  {selectedCandidate.name || "Anonymous Developer"}
                  {selectedCandidate.devScore && (
                    <span className="text-[10px] bg-[var(--accent)]/10 text-[var(--accent)] px-2 py-0.5 rounded border border-[var(--accent)]/20 font-mono">
                      {selectedCandidate.devScore.rank}
                    </span>
                  )}
                </h3>
                <span className="text-xs text-[var(--foreground-tertiary)] block mt-0.5">@{selectedCandidate.username || "dev"}</span>
                <span className="text-[10px] text-[var(--foreground-tertiary)] block mt-1">Level {selectedCandidate.level} · {selectedCandidate.xp.toLocaleString()} XP</span>
              </div>
            </div>

            {/* Scores and metrics */}
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              <div className="border border-[var(--border)] bg-[var(--background)] p-3 rounded-lg flex flex-col items-center">
                <span className="text-[9px] text-[var(--foreground-tertiary)] uppercase font-semibold">Dev Score</span>
                <span className="text-lg font-bold text-[var(--foreground)] mt-1 font-mono">
                  {selectedCandidate.devScore ? Math.round(selectedCandidate.devScore.overallScore) : "Unrated"}
                </span>
              </div>

              <div className="border border-[var(--border)] bg-[var(--background)] p-3 rounded-lg flex flex-col items-center">
                <span className="text-[9px] text-[var(--foreground-tertiary)] uppercase font-semibold">Readiness Score</span>
                <span className="text-lg font-bold text-emerald-400 mt-1 font-mono">
                  {selectedCandidate.readinessScore !== null ? `${Math.round(selectedCandidate.readinessScore)}%` : "N/A"}
                </span>
              </div>

              <div className="border border-[var(--border)] bg-[var(--background)] p-3 rounded-lg flex flex-col items-center">
                <span className="text-[9px] text-[var(--foreground-tertiary)] uppercase font-semibold">GitHub Stars</span>
                <span className="text-lg font-bold text-blue-400 mt-1 font-mono">
                  {selectedCandidate.githubProfile ? selectedCandidate.githubProfile.totalStars : "N/A"}
                </span>
              </div>

              <div className="border border-[var(--border)] bg-[var(--background)] p-3 rounded-lg flex flex-col items-center">
                <span className="text-[9px] text-[var(--foreground-tertiary)] uppercase font-semibold">GitHub Followers</span>
                <span className="text-lg font-bold text-sky-400 mt-1 font-mono">
                  {selectedCandidate.githubProfile ? selectedCandidate.githubProfile.followers : "N/A"}
                </span>
              </div>
            </div>

            {/* Score breakdown if available */}
            {selectedCandidate.devScore && (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-[var(--foreground)]">Developer Competency Breakdown</h4>
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-5">
                  <div className="bg-[var(--surface)] p-2.5 rounded-lg border border-[var(--border)] text-center">
                    <span className="text-[8px] text-[var(--foreground-tertiary)] block uppercase">GitHub</span>
                    <span className="text-xs font-bold font-mono text-[var(--foreground)]">{Math.round(selectedCandidate.devScore.githubScore)}</span>
                  </div>
                  <div className="bg-[var(--surface)] p-2.5 rounded-lg border border-[var(--border)] text-center">
                    <span className="text-[8px] text-[var(--foreground-tertiary)] block uppercase">Projects</span>
                    <span className="text-xs font-bold font-mono text-[var(--foreground)]">{Math.round(selectedCandidate.devScore.projectScore)}</span>
                  </div>
                  <div className="bg-[var(--surface)] p-2.5 rounded-lg border border-[var(--border)] text-center">
                    <span className="text-[8px] text-[var(--foreground-tertiary)] block uppercase">Skills</span>
                    <span className="text-xs font-bold font-mono text-[var(--foreground)]">{Math.round(selectedCandidate.devScore.skillScore)}</span>
                  </div>
                  <div className="bg-[var(--surface)] p-2.5 rounded-lg border border-[var(--border)] text-center">
                    <span className="text-[8px] text-[var(--foreground-tertiary)] block uppercase">Resume</span>
                    <span className="text-xs font-bold font-mono text-[var(--foreground)]">{Math.round(selectedCandidate.devScore.resumeScore)}</span>
                  </div>
                  <div className="bg-[var(--surface)] p-2.5 rounded-lg border border-[var(--border)] text-center">
                    <span className="text-[8px] text-[var(--foreground-tertiary)] block uppercase">Deployment</span>
                    <span className="text-xs font-bold font-mono text-[var(--foreground)]">{Math.round(selectedCandidate.devScore.deploymentScore)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Skills audit lists */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-[var(--foreground)]">Candidate Skill Inventory</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedCandidate.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-[var(--surface)] px-3 py-0.5 text-[10px] font-semibold text-[var(--foreground-secondary)] border border-[var(--border)]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 border-t border-[var(--border)] pt-4">
              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="h-9 px-4 rounded-lg border border-[var(--border)] hover:bg-[var(--surface)] text-xs font-semibold text-[var(--foreground-secondary)] transition-colors cursor-pointer"
              >
                Close sheet
              </button>
              {selectedCandidate.username && (
                <Link
                  href={`/u/${selectedCandidate.username}`}
                  target="_blank"
                  className="h-9 px-4 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-xs font-semibold text-white transition-colors flex items-center gap-1.5 cursor-pointer ml-auto"
                >
                  View Public Profile <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
