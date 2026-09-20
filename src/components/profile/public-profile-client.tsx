"use client";

import { ProgressRing } from "@/components/charts/progress-ring";
import Image from "next/image";
import {
  Award,
  Globe,
  Code2,
  Briefcase,
  Map,
  CheckCircle2,
  Sparkles,
  GitBranch,
  Star,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

function Linkedin(props: React.SVGProps<SVGSVGElement>) {
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

function Twitter(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

interface AchievementItem {
  type: string;
  title: string;
  description: string;
  icon: string;
}

interface RoadmapDetails {
  title: string;
  techStack: string[];
  weeklyGoals: Array<{ id: string; title: string; completed: boolean }>;
}

interface PublicProfileClientProps {
  profile: {
    name: string;
    username: string;
    bio: string;
    image: string | null;
    level: number;
    xp: number;
    plan?: string;
    isEarlyAdopter?: boolean;
    premiumExpiresAt?: Date | string | null;
    careerGoals: string[];
    connectedAccounts: Record<string, string>;
    devScore: {
      overallScore: number;
      rank: string;
      level: string;
      githubScore: number;
      projectScore: number;
      skillScore: number;
      resumeScore: number;
      deploymentScore: number;
    } | null;
    github: {
      username: string;
      avatarUrl: string | null;
      publicRepos: number;
      followers: number;
      totalStars: number;
      languages: Record<string, number>;
    } | null;
    portfolioScore: number | null;
    readinessScore: number | null;
    skills: string[];
    achievements: AchievementItem[];
    roadmap: RoadmapDetails | null;
  };
}

export function PublicProfileClient({ profile }: PublicProfileClientProps) {
  // Helper to map icon string to Lucide component
  const renderAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case "Award":
        return <Award className="h-5 w-5 text-yellow-400 shrink-0" />;
      case "Sparkles":
        return <Sparkles className="h-5 w-5 text-emerald-400 shrink-0" />;
      case "Code2":
        return <Code2 className="h-5 w-5 text-blue-400 shrink-0" />;
      case "Globe":
        return <Globe className="h-5 w-5 text-sky-400 shrink-0" />;
      case "Briefcase":
        return <Briefcase className="h-5 w-5 text-purple-400 shrink-0" />;
      case "Map":
        return <Map className="h-5 w-5 text-amber-400 shrink-0" />;
      default:
        return <Award className="h-5 w-5 text-[var(--accent)] shrink-0" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header Card */}
      <div className="card-base p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8 bg-[var(--card)] border border-[var(--border)]">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left min-w-0">
          {profile.image ? (
            <Image
              src={profile.image}
              alt={profile.name}
              width={80}
              height={80}
              unoptimized
              className="h-20 w-20 rounded-full border-2 border-[var(--border)] shrink-0"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--surface)] border-2 border-[var(--border)] text-2xl font-extrabold text-[var(--foreground-secondary)] uppercase shrink-0">
              {profile.name.substring(0, 2)}
            </div>
          )}
          
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-[var(--foreground)] truncate">{profile.name}</h1>
              {profile.plan === "PRO" && (() => {
                const subStatus = (() => {
                  if (!profile.premiumExpiresAt) return "ACTIVE";
                  const expiry = new Date(profile.premiumExpiresAt).getTime();
                  const now = Date.now();
                  if (expiry < now) return "EXPIRED";
                  const remainingDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
                  if (remainingDays <= 30) return "EXPIRING SOON";
                  return "ACTIVE";
                })();

                return (
                  <>
                    <span className="inline-flex items-center rounded bg-blue-500/10 px-1.5 py-0.5 text-[8px] font-black text-blue-400 uppercase tracking-widest border border-blue-500/20">
                      PRO
                    </span>
                    {subStatus === "ACTIVE" && (
                      <span className="inline-flex items-center rounded bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-black text-emerald-400 uppercase tracking-widest border border-emerald-500/20">
                        ACTIVE
                      </span>
                    )}
                    {subStatus === "EXPIRING SOON" && (
                      <span className="inline-flex items-center rounded bg-amber-500/10 px-1.5 py-0.5 text-[8px] font-black text-amber-400 uppercase tracking-widest border border-amber-500/20 animate-pulse">
                        EXPIRING SOON
                      </span>
                    )}
                    {subStatus === "EXPIRED" && (
                      <span className="inline-flex items-center rounded bg-red-500/10 px-1.5 py-0.5 text-[8px] font-black text-red-400 uppercase tracking-widest border border-red-500/20">
                        EXPIRED
                      </span>
                    )}
                  </>
                );
              })()}
              {profile.isEarlyAdopter && (
                <span className="inline-flex items-center rounded bg-rose-500/10 px-1.5 py-0.5 text-[8px] font-black text-rose-400 uppercase tracking-widest border border-rose-500/20">
                  FOUNDING USER
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--accent)] font-mono">@{profile.username}</p>
            {profile.bio && (
              <p className="text-xs text-[var(--foreground-secondary)] max-w-md leading-relaxed mt-1">{profile.bio}</p>
            )}
            
            {/* Connected handles */}
            <div className="flex flex-wrap gap-3.5 pt-2 justify-center sm:justify-start">
              {profile.connectedAccounts.linkedin && (
                <a
                  href={profile.connectedAccounts.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--foreground-secondary)] hover:text-blue-400 transition-colors"
                  title="LinkedIn Profile"
                >
                  <Linkedin className="h-4.5 w-4.5" />
                </a>
              )}
              {profile.connectedAccounts.twitter && (
                <a
                  href={`https://twitter.com/${profile.connectedAccounts.twitter.replace(/^@/, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--foreground-secondary)] hover:text-sky-400 transition-colors"
                  title="Twitter/X Profile"
                >
                  <Twitter className="h-4.5 w-4.5" />
                </a>
              )}
              {profile.connectedAccounts.github && (
                <a
                  href={`https://github.com/${profile.connectedAccounts.github}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors"
                  title="GitHub Profile"
                >
                  <GithubIcon className="h-4.5 w-4.5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {profile.devScore ? (
          <div className="flex flex-col items-center gap-1.5">
            <ProgressRing score={profile.devScore.overallScore} size={130} strokeWidth={9} />
            <div className="flex items-center gap-2 mt-1 bg-[var(--surface)] border border-[var(--border)] px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-secondary)]">
              <span>Level {profile.level}</span>
              <span className="text-[var(--border)]">|</span>
              <span>{profile.devScore.level}</span>
            </div>
          </div>
        ) : (
          <div className="text-xs text-[var(--foreground-tertiary)] italic">Score not compiled yet.</div>
        )}
      </div>

      {/* 2. Grid Sections */}
      <div className="grid gap-6 md:grid-cols-12 items-start">
        {/* Left Column: Stats, skills, achievements */}
        <div className="md:col-span-7 space-y-6">
          
          {/* Developer Score breakdown */}
          {profile.devScore && (
            <div className="card-base p-6 space-y-4">
              <h3 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider border-b border-[var(--border)] pb-2.5">
                Developer Competencies
              </h3>
              
              <div className="grid gap-3.5 sm:grid-cols-2 text-xs">
                {/* GitHub */}
                <div className="flex items-center justify-between bg-[var(--surface)] border border-[var(--border)] p-2.5 rounded-lg">
                  <span className="text-[var(--foreground-secondary)] font-medium">GitHub Score</span>
                  <span className="font-extrabold text-[var(--accent)]">{profile.devScore.githubScore}/100</span>
                </div>
                {/* Resume */}
                <div className="flex items-center justify-between bg-[var(--surface)] border border-[var(--border)] p-2.5 rounded-lg">
                  <span className="text-[var(--foreground-secondary)] font-medium">Resume Rating</span>
                  <span className="font-extrabold text-[var(--accent)]">{profile.devScore.resumeScore}/100</span>
                </div>
                {/* Project */}
                <div className="flex items-center justify-between bg-[var(--surface)] border border-[var(--border)] p-2.5 rounded-lg">
                  <span className="text-[var(--foreground-secondary)] font-medium">Architecture Rating</span>
                  <span className="font-extrabold text-[var(--accent)]">{profile.devScore.projectScore}/100</span>
                </div>
                {/* Deployment */}
                <div className="flex items-center justify-between bg-[var(--surface)] border border-[var(--border)] p-2.5 rounded-lg">
                  <span className="text-[var(--foreground-secondary)] font-medium">CI/CD & Configs</span>
                  <span className="font-extrabold text-[var(--accent)]">{profile.devScore.deploymentScore}/100</span>
                </div>
              </div>
            </div>
          )}

          {/* GitHub Stats */}
          {profile.github && (
            <div className="card-base p-6 space-y-4">
              <h3 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider border-b border-[var(--border)] pb-2.5 flex items-center gap-1.5">
                <GithubIcon className="h-4 w-4 text-[var(--foreground-secondary)]" /> GitHub Activity
              </h3>
              <div className="grid gap-4 grid-cols-3 text-center">
                <div className="bg-[var(--surface)] border border-[var(--border)] p-3 rounded-lg">
                  <Star className="h-4 w-4 text-amber-400 mx-auto mb-1" />
                  <span className="text-xs font-bold text-[var(--foreground)]">{profile.github.totalStars}</span>
                  <p className="text-[9px] text-[var(--foreground-tertiary)] uppercase mt-0.5">Stars</p>
                </div>
                <div className="bg-[var(--surface)] border border-[var(--border)] p-3 rounded-lg">
                  <GitBranch className="h-4 w-4 text-blue-400 mx-auto mb-1" />
                  <span className="text-xs font-bold text-[var(--foreground)]">{profile.github.publicRepos}</span>
                  <p className="text-[9px] text-[var(--foreground-tertiary)] uppercase mt-0.5">Repositories</p>
                </div>
                <div className="bg-[var(--surface)] border border-[var(--border)] p-3 rounded-lg">
                  <Users className="h-4 w-4 text-emerald-400 mx-auto mb-1" />
                  <span className="text-xs font-bold text-[var(--foreground)]">{profile.github.followers}</span>
                  <p className="text-[9px] text-[var(--foreground-tertiary)] uppercase mt-0.5">Followers</p>
                </div>
              </div>
            </div>
          )}

          {/* Achievements Grid */}
          {profile.achievements.length > 0 && (
            <div className="card-base p-6 space-y-4">
              <h3 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider border-b border-[var(--border)] pb-2.5">
                Achievements & Milestones
              </h3>
              
              <div className="grid gap-3.5 sm:grid-cols-2">
                {profile.achievements.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-[var(--surface)] border border-[var(--border)] p-3 rounded-lg text-xs leading-relaxed">
                    {renderAchievementIcon(item.icon)}
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-[var(--foreground)]">{item.title}</h4>
                      <p className="text-[10px] text-[var(--foreground-secondary)]">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Career direction, skills list, roadmap progress */}
        <div className="md:col-span-5 space-y-6">
          
          {/* Career goals & readiness summary */}
          <div className="card-base p-5 space-y-4">
            <h3 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider border-b border-[var(--border)] pb-2.5">
              Career Path Focus
            </h3>
            
            <div className="space-y-3.5 text-xs">
              {profile.careerGoals.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-[var(--foreground-tertiary)] uppercase tracking-wider">Targets</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {profile.careerGoals.map((goal, idx) => (
                      <span key={idx} className="bg-[var(--surface)] border border-[var(--border)] px-2 py-0.5 rounded text-[10px] font-medium text-[var(--foreground-secondary)]">
                        {goal}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {profile.readinessScore !== null && (
                <div className="flex items-center justify-between border-t border-[var(--border)] pt-3.5">
                  <span className="text-[10px] font-semibold text-[var(--foreground-tertiary)] uppercase tracking-wider">Internship Readiness</span>
                  <span className="font-bold text-emerald-400">{profile.readinessScore}% Match</span>
                </div>
              )}

              {profile.portfolioScore !== null && (
                <div className="flex items-center justify-between border-t border-[var(--border)] pt-3.5">
                  <span className="text-[10px] font-semibold text-[var(--foreground-tertiary)] uppercase tracking-wider">Portfolio Rating</span>
                  <span className="font-bold text-blue-400">{profile.portfolioScore}/100</span>
                </div>
              )}
            </div>
          </div>

          {/* Technical stack list */}
          {profile.skills.length > 0 && (
            <div className="card-base p-5 space-y-3">
              <h3 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider border-b border-[var(--border)] pb-2">
                Tech Stack & Competencies
              </h3>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {profile.skills.map((s, idx) => (
                  <span key={idx} className="bg-[var(--surface)] border border-[var(--border)] px-2 py-0.5 rounded text-[10px] text-[var(--foreground-secondary)] font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Public Learning roadmap */}
          {profile.roadmap && (
            <div className="card-base p-5 space-y-4">
              <h3 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider border-b border-[var(--border)] pb-2.5 flex items-center gap-1.5">
                <Map className="h-4 w-4 text-[var(--foreground-secondary)]" /> Public Learning Path
              </h3>
              <div className="space-y-3 text-xs">
                <h4 className="font-bold text-[var(--foreground)]">{profile.roadmap.title}</h4>
                
                <div className="space-y-2">
                  <span className="text-[10px] font-semibold text-[var(--foreground-tertiary)] uppercase tracking-wider">Milestones checklist</span>
                  <div className="space-y-2">
                    {profile.roadmap.weeklyGoals.slice(0, 5).map((goal) => (
                      <div key={goal.id} className="flex items-start gap-2 text-[11px] leading-relaxed text-[var(--foreground-secondary)]">
                        <CheckCircle2 className={cn("h-4 w-4 shrink-0 mt-0.5", goal.completed ? "text-emerald-400" : "text-[var(--foreground-muted)]")} />
                        <span className={cn(goal.completed ? "line-through text-[var(--foreground-tertiary)]" : "")}>{goal.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
