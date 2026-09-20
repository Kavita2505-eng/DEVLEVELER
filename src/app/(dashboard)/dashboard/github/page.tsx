import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { GitHubClient } from "@/components/dashboard/github-client";
import type { GitHubAnalysis, LanguageDistribution, GitHubRepo } from "@/types";

export default async function GitHubPage() {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Fetch the user's saved github profile
  const profile = await prisma.gitHubProfile.findUnique({
    where: { userId },
  });

  let initialAnalysis: GitHubAnalysis | null = null;

  if (profile) {
    // Reconstruct the structure from DB fields
    function parseJson<T>(val: unknown, fallback: T): T {
      if (typeof val === "string") {
        try {
          return JSON.parse(val) as T;
        } catch {
          return fallback;
        }
      }
      return (val as T) || fallback;
    }
    const languages = parseJson(profile.languages, [] as LanguageDistribution[]);
    const topRepos = parseJson(profile.topRepos, [] as GitHubRepo[]);

    initialAnalysis = {
      user: {
        login: profile.username,
        name: session.user.name ?? null,
        avatar_url: profile.avatarUrl ?? "",
        bio: profile.bio ?? null,
        public_repos: profile.publicRepos,
        followers: profile.followers,
        following: profile.following,
        created_at: "", // optional/empty
        html_url: `https://github.com/${profile.username}`,
        location: null,
        blog: null,
        company: null,
      },
      repos: [],
      stats: {
        totalRepos: profile.publicRepos,
        totalStars: profile.totalStars,
        totalForks: profile.totalForks,
        totalWatchers: 0,
        followers: profile.followers,
        following: profile.following,
        avgStarsPerRepo: profile.publicRepos > 0 ? Math.round((profile.totalStars / profile.publicRepos) * 10) / 10 : 0,
        reposWithDescription: 0,
        reposWithTopics: 0,
        reposWithLicense: 0,
        accountAgeDays: 0,
      },
      languages,
      topRepos,
      scores: {
        overall: profile.githubScore,
        activity: profile.activityScore,
        repoHealth: profile.repoHealth,
        community: 0, // derived
        consistency: 0, // derived
      },
    };
  }

  return (
    <div className="space-y-6">
      <GitHubClient initialAnalysis={initialAnalysis} userId={userId} />
    </div>
  );
}
