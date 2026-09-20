// ============================================================
// DevLeveler — GitHub Public API Service
// ============================================================

import type {
  GitHubUser,
  GitHubRepo,
  GitHubAnalysis,
  GitHubStats,
  GitHubScores,
  LanguageDistribution,
} from "@/types";
import { LANGUAGE_COLORS, DEFAULT_LANGUAGE_COLOR } from "@/types";

const GITHUB_API = "https://api.github.com";

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

import { env } from "@/lib/env";

function githubHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  const token = env.GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function githubFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: githubHeaders(),
    next: { revalidate: 300 }, // cache for 5 min in Next.js
  });

  if (res.status === 404) {
    throw new Error("GitHub user not found");
  }

  if (res.status === 403) {
    const remaining = res.headers.get("x-ratelimit-remaining");
    if (remaining === "0") {
      const resetAt = res.headers.get("x-ratelimit-reset");
      const resetDate = resetAt
        ? new Date(Number(resetAt) * 1000).toLocaleTimeString()
        : "soon";
      throw new Error(
        `GitHub API rate limit exceeded. Resets at ${resetDate}. Add a GITHUB_TOKEN in your .env for higher limits.`
      );
    }
    throw new Error("GitHub API access forbidden");
  }

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Public API: Fetch user
// ---------------------------------------------------------------------------

export async function fetchGitHubUser(username: string): Promise<GitHubUser> {
  const data = await githubFetch<Record<string, unknown>>(
    `${GITHUB_API}/users/${encodeURIComponent(username)}`
  );

  return {
    login: data.login as string,
    name: (data.name as string | null) ?? null,
    avatar_url: data.avatar_url as string,
    bio: (data.bio as string | null) ?? null,
    public_repos: data.public_repos as number,
    followers: data.followers as number,
    following: data.following as number,
    created_at: data.created_at as string,
    html_url: data.html_url as string,
    location: (data.location as string | null) ?? null,
    blog: (data.blog as string | null) ?? null,
    company: (data.company as string | null) ?? null,
  };
}

// ---------------------------------------------------------------------------
// Public API: Fetch repos
// ---------------------------------------------------------------------------

export async function fetchGitHubRepos(
  username: string
): Promise<GitHubRepo[]> {
  const data = await githubFetch<Record<string, unknown>[]>(
    `${GITHUB_API}/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`
  );

  return data.map((repo) => ({
    id: repo.id as number,
    name: repo.name as string,
    full_name: repo.full_name as string,
    description: (repo.description as string | null) ?? null,
    html_url: repo.html_url as string,
    language: (repo.language as string | null) ?? null,
    stargazers_count: repo.stargazers_count as number,
    forks_count: repo.forks_count as number,
    watchers_count: repo.watchers_count as number,
    open_issues_count: repo.open_issues_count as number,
    created_at: repo.created_at as string,
    updated_at: repo.updated_at as string,
    pushed_at: repo.pushed_at as string,
    size: repo.size as number,
    topics: (repo.topics as string[]) ?? [],
    fork: repo.fork as boolean,
    archived: repo.archived as boolean,
    has_wiki: repo.has_wiki as boolean,
    has_pages: repo.has_pages as boolean,
    license: repo.license
      ? {
          key: (repo.license as Record<string, string>).key,
          name: (repo.license as Record<string, string>).name,
        }
      : null,
  }));
}

// ---------------------------------------------------------------------------
// Language distribution
// ---------------------------------------------------------------------------

function calculateLanguageDistribution(
  repos: GitHubRepo[]
): LanguageDistribution[] {
  const counts: Record<string, number> = {};
  let totalWithLang = 0;

  for (const repo of repos) {
    if (repo.language && !repo.fork) {
      counts[repo.language] = (counts[repo.language] || 0) + 1;
      totalWithLang++;
    }
  }

  if (totalWithLang === 0) return [];

  return Object.entries(counts)
    .map(([name, value]) => ({
      name,
      value,
      percentage: Math.round((value / totalWithLang) * 1000) / 10,
      color: LANGUAGE_COLORS[name] ?? DEFAULT_LANGUAGE_COLOR,
    }))
    .sort((a, b) => b.value - a.value);
}

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------

function calculateStats(
  user: GitHubUser,
  repos: GitHubRepo[]
): GitHubStats {
  const nonForkRepos = repos.filter((r) => !r.fork);
  const totalStars = nonForkRepos.reduce((s, r) => s + r.stargazers_count, 0);
  const totalForks = nonForkRepos.reduce((s, r) => s + r.forks_count, 0);
  const totalWatchers = nonForkRepos.reduce(
    (s, r) => s + r.watchers_count,
    0
  );
  const reposWithDescription = nonForkRepos.filter(
    (r) => r.description && r.description.trim().length > 0
  ).length;
  const reposWithTopics = nonForkRepos.filter(
    (r) => r.topics && r.topics.length > 0
  ).length;
  const reposWithLicense = nonForkRepos.filter((r) => r.license !== null).length;

  const accountCreated = new Date(user.created_at);
  const accountAgeDays = Math.floor(
    (Date.now() - accountCreated.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    totalRepos: nonForkRepos.length,
    totalStars,
    totalForks,
    totalWatchers,
    followers: user.followers,
    following: user.following,
    avgStarsPerRepo:
      nonForkRepos.length > 0
        ? Math.round((totalStars / nonForkRepos.length) * 10) / 10
        : 0,
    reposWithDescription,
    reposWithTopics,
    reposWithLicense,
    accountAgeDays,
  };
}

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function calculateScores(
  user: GitHubUser,
  repos: GitHubRepo[],
  stats: GitHubStats
): GitHubScores {
  const nonForkRepos = repos.filter((r) => !r.fork);

  // ---- Activity Score (0-100) ----
  // Recent pushes, account age, repo count
  const now = Date.now();
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
  const ninetyDaysAgo = now - 90 * 24 * 60 * 60 * 1000;

  const recentPushes = nonForkRepos.filter(
    (r) => new Date(r.pushed_at).getTime() > thirtyDaysAgo
  ).length;
  const moderatePushes = nonForkRepos.filter(
    (r) =>
      new Date(r.pushed_at).getTime() > ninetyDaysAgo &&
      new Date(r.pushed_at).getTime() <= thirtyDaysAgo
  ).length;

  const recentActivityScore = Math.min(40, recentPushes * 10);
  const moderateActivityScore = Math.min(20, moderatePushes * 5);
  const repoCountScore = Math.min(25, nonForkRepos.length * 2.5);
  const accountAgeScore = Math.min(15, (stats.accountAgeDays / 365) * 5);

  const activity = clamp(
    recentActivityScore + moderateActivityScore + repoCountScore + accountAgeScore
  );

  // ---- Repo Health Score (0-100) ----
  // Descriptions, topics, licenses, README potential (has_wiki)
  const total = nonForkRepos.length || 1;
  const descPct = (stats.reposWithDescription / total) * 100;
  const topicPct = (stats.reposWithTopics / total) * 100;
  const licensePct = (stats.reposWithLicense / total) * 100;

  const repoHealth = clamp(
    descPct * 0.35 + topicPct * 0.30 + licensePct * 0.20 + Math.min(15, stats.totalStars * 1.5)
  );

  // ---- Community Score (0-100) ----
  const followerScore = Math.min(35, user.followers * 1.5);
  const starsScore = Math.min(35, stats.totalStars * 2);
  const forksScore = Math.min(20, stats.totalForks * 3);
  const diversityScore = Math.min(
    10,
    new Set(nonForkRepos.map((r) => r.language).filter(Boolean)).size * 2
  );

  const community = clamp(
    followerScore + starsScore + forksScore + diversityScore
  );

  // ---- Consistency Score (0-100) ----
  // Spread of repo creation over time
  const sixMonthsAgo = now - 180 * 24 * 60 * 60 * 1000;
  const oneYearAgo = now - 365 * 24 * 60 * 60 * 1000;

  const reposLastSixMonths = nonForkRepos.filter(
    (r) => new Date(r.created_at).getTime() > sixMonthsAgo
  ).length;
  const reposLastYear = nonForkRepos.filter(
    (r) => new Date(r.created_at).getTime() > oneYearAgo
  ).length;

  const consistency = clamp(
    Math.min(40, reposLastSixMonths * 8) +
      Math.min(30, reposLastYear * 4) +
      Math.min(30, (stats.accountAgeDays / 365) * 10)
  );

  // ---- Overall ----
  const overall = clamp(
    activity * 0.30 + repoHealth * 0.25 + community * 0.25 + consistency * 0.20
  );

  return { overall, activity, repoHealth, community, consistency };
}

// ---------------------------------------------------------------------------
// Public API: Full analysis
// ---------------------------------------------------------------------------

export async function analyzeGitHubProfile(
  username: string
): Promise<GitHubAnalysis> {
  const [user, repos] = await Promise.all([
    fetchGitHubUser(username),
    fetchGitHubRepos(username),
  ]);

  const stats = calculateStats(user, repos);
  const languages = calculateLanguageDistribution(repos);
  const scores = calculateScores(user, repos, stats);

  const topRepos = [...repos]
    .filter((r) => !r.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 6);

  return { user, repos, stats, languages, topRepos, scores };
}
