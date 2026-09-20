"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/types";

export interface CandidateSearchFilters {
  query?: string;
  skills?: string[];
  minDevScore?: number;
  maxDevScore?: number;
  minReadinessScore?: number;
  maxReadinessScore?: number;
  level?: string; // e.g. "Beginner" | "Explorer" | "Builder" | "Engineer" | "Architect" | "Master"
  page?: number;
  limit?: number;
}

export interface CandidateProfile {
  id: string;
  name: string | null;
  username: string | null;
  bio: string | null;
  image: string | null;
  xp: number;
  level: number;
  plan: string;
  devScore: {
    overallScore: number;
    githubScore: number;
    projectScore: number;
    skillScore: number;
    resumeScore: number;
    deploymentScore: number;
    rank: string;
  } | null;
  readinessScore: number | null;
  skills: string[];
  githubProfile: {
    username: string;
    avatarUrl: string | null;
    totalStars: number;
    followers: number;
    languages: Record<string, number>;
  } | null;
}

export async function searchDevelopersAction(
  filters: CandidateSearchFilters
): Promise<ApiResponse<{ candidates: CandidateProfile[]; totalCount: number }>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify user role (Recruiter or Admin)
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!currentUser || (currentUser.role !== "RECRUITER" && currentUser.role !== "ADMIN")) {
      return { success: false, error: "Access restricted to recruiters and admins." };
    }

    const {
      query = "",
      skills = [],
      minDevScore = 0,
      maxDevScore = 100,
      minReadinessScore = 0,
      maxReadinessScore = 100,
      level = "",
      page = 1,
      limit = 10,
    } = filters;

    const skip = (page - 1) * limit;

    // 1. Fetch public developers matching filters
    const users = await prisma.user.findMany({
      where: {
        role: "DEVELOPER",
        isPublic: true,
        OR: query.trim() !== ""
          ? [
              { name: { contains: query, mode: "insensitive" } },
              { username: { contains: query, mode: "insensitive" } },
              { email: { contains: query, mode: "insensitive" } },
              { bio: { contains: query, mode: "insensitive" } },
            ]
          : undefined,
        devScore: {
          overallScore: {
            gte: minDevScore,
            lte: maxDevScore,
          },
          rank: level !== "" ? level : undefined,
        },
        readiness: minReadinessScore > 0 || maxReadinessScore < 100
          ? {
              overallScore: {
                gte: minReadinessScore,
                lte: maxReadinessScore,
              },
            }
          : undefined,
      },
      include: {
        devScore: true,
        readiness: true,
        githubProfile: true,
        resumes: {
          orderBy: { analyzedAt: "desc" },
          take: 1,
        },
      },
      orderBy: { xp: "desc" },
    });

    // 2. Format candidates and filter by skills in-memory since skill arrays are stored in JSON
    let formattedCandidates: CandidateProfile[] = users.map((u) => {
      const skillsSet = new Set<string>();

      // Parse custom skills
      try {
        if (u.customSkills) {
          const parsed = typeof u.customSkills === "string" ? JSON.parse(u.customSkills) : u.customSkills;
          if (Array.isArray(parsed)) parsed.forEach((s) => skillsSet.add(s));
        }
      } catch {}

      // Parse resume skills
      try {
        if (u.resumes[0]?.skills) {
          const parsed = typeof u.resumes[0].skills === "string" ? JSON.parse(u.resumes[0].skills) : u.resumes[0].skills;
          if (Array.isArray(parsed)) parsed.forEach((s) => skillsSet.add(s));
        }
      } catch {}

      // Parse GitHub languages
      try {
        if (u.githubProfile?.languages) {
          const parsed = typeof u.githubProfile.languages === "string" ? JSON.parse(u.githubProfile.languages as string) : u.githubProfile.languages;
          Object.keys(parsed).forEach((k) => skillsSet.add(k));
        }
      } catch {}

      return {
        id: u.id,
        name: u.name,
        username: u.username,
        bio: u.bio,
        image: u.image,
        xp: u.xp,
        level: u.level,
        plan: u.plan,
        devScore: u.devScore
          ? {
              overallScore: u.devScore.overallScore,
              githubScore: u.devScore.githubScore,
              projectScore: u.devScore.projectScore,
              skillScore: u.devScore.skillScore,
              resumeScore: u.devScore.resumeScore,
              deploymentScore: u.devScore.deploymentScore,
              rank: u.devScore.rank,
            }
          : null,
        readinessScore: u.readiness?.overallScore ?? null,
        skills: Array.from(skillsSet),
        githubProfile: u.githubProfile
          ? {
              username: u.githubProfile.username,
              avatarUrl: u.githubProfile.avatarUrl,
              totalStars: u.githubProfile.totalStars,
              followers: u.githubProfile.followers,
              languages: typeof u.githubProfile.languages === "string" ? JSON.parse(u.githubProfile.languages) : u.githubProfile.languages,
            }
          : null,
      };
    });

    // Filter by skills if list provided
    if (skills.length > 0) {
      formattedCandidates = formattedCandidates.filter((c) =>
        skills.every((reqSkill) =>
          c.skills.some((s) => s.toLowerCase() === reqSkill.toLowerCase())
        )
      );
    }

    const totalCount = formattedCandidates.length;
    const paginatedCandidates = formattedCandidates.slice(skip, skip + limit);

    return {
      success: true,
      data: {
        candidates: paginatedCandidates,
        totalCount,
      },
    };
  } catch (error) {
    console.error("Error in searchDevelopersAction:", error);
    return { success: false, error: "Failed to search candidates." };
  }
}

export async function getRecruiterOverviewAction(): Promise<ApiResponse<{ totalCandidates: number; commonSkills: string[] }>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const totalCandidates = await prisma.user.count({
      where: {
        role: "DEVELOPER",
        isPublic: true,
      },
    });

    // Hardcode some top trending search tags for convenience
    const commonSkills = ["TypeScript", "React", "Node.js", "Python", "PostgreSQL", "Next.js", "TailwindCSS", "Docker"];

    return {
      success: true,
      data: {
        totalCandidates,
        commonSkills,
      },
    };
  } catch (error) {
    console.error("Error in getRecruiterOverviewAction:", error);
    return { success: false, error: "Failed to fetch recruiter overview stats." };
  }
}
