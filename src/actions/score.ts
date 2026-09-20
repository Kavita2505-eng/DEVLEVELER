"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { calculateDeveloperScore } from "@/lib/scoring";
import { createNotificationAction } from "@/actions/notifications";
import type { ApiResponse, DeveloperScoreData } from "@/types";

export async function calculateScore(
  userId: string
): Promise<ApiResponse<DeveloperScoreData>> {
  try {
    const session = await auth();
    if (!session || session.user?.id !== userId) {
      return { success: false, error: "Unauthorized access" };
    }

    // 1. Fetch relevant profiles to calculate scores
    const [githubProfile, resume, currentDevScore] = await Promise.all([
      prisma.gitHubProfile.findUnique({ where: { userId } }),
      prisma.resume.findFirst({
        where: { userId },
        orderBy: { analyzedAt: "desc" },
      }),
      prisma.developerScore.findUnique({
        where: { userId },
        select: { overallScore: true },
      }),
    ]);

    // 2. Derive individual scores
    const githubScore = githubProfile?.githubScore ?? undefined;
    const resumeScore = resume?.qualityScore ?? undefined;

    // Project score based on github stars & descriptions or resume projects
    let projectScore: number | undefined = undefined;
    if (githubProfile || resume) {
      let scoreSum = 0;
      let count = 0;
      if (githubProfile) {
        // Average repo health or stars
        scoreSum += (githubProfile.repoHealth as number);
        count++;
      }
      if (resume) {
        // Evaluate project quality
        const projects = JSON.parse(resume.projects as string || "[]");
        const hasProj = projects.length > 0;
        scoreSum += hasProj ? 75 : 30;
        count++;
      }
      projectScore = count > 0 ? Math.round(scoreSum / count) : undefined;
    }

    // Skill score based on number of languages / skills
    let skillScore: number | undefined = undefined;
    if (githubProfile || resume) {
      let skillsCount = 0;
      if (githubProfile) {
        const langs = JSON.parse(githubProfile.languages as string || "[]");
        skillsCount += langs.length;
      }
      if (resume) {
        const skills = JSON.parse(resume.skills as string || "[]");
        skillsCount += skills.length;
      }
      skillScore = Math.min(100, Math.max(30, skillsCount * 4));
    }

    // Deployment score: if they have a github profile and resume, estimate deployment experience
    let deploymentScore: number | undefined = undefined;
    if (githubProfile) {
      // If user has repositories with descriptions or license
      deploymentScore = githubProfile.publicRepos > 10 ? 80 : 50;
    }

    // 3. Compute final score using engine
    const scoreData = calculateDeveloperScore({
      githubScore,
      projectScore,
      skillScore,
      resumeScore,
      deploymentScore,
    });

    // 4. Save/update to Database
    await prisma.developerScore.upsert({
      where: { userId },
      update: {
        overallScore: scoreData.overallScore,
        githubScore: scoreData.githubScore,
        projectScore: scoreData.projectScore,
        skillScore: scoreData.skillScore,
        resumeScore: scoreData.resumeScore,
        deploymentScore: scoreData.deploymentScore,
        rank: scoreData.rank,
        level: scoreData.level,
        breakdown: JSON.stringify(scoreData.breakdown),
        calculatedAt: new Date(),
      },
      create: {
        userId,
        overallScore: scoreData.overallScore,
        githubScore: scoreData.githubScore,
        projectScore: scoreData.projectScore,
        skillScore: scoreData.skillScore,
        resumeScore: scoreData.resumeScore,
        deploymentScore: scoreData.deploymentScore,
        rank: scoreData.rank,
        level: scoreData.level,
        breakdown: JSON.stringify(scoreData.breakdown),
      },
    });

    // 5. Log in ScoreHistory (collapsing duplicate records per day)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const historyToday = await prisma.scoreHistory.findFirst({
      where: {
        userId,
        recordedAt: {
          gte: startOfToday,
        },
      },
    });

    if (!historyToday) {
      await prisma.scoreHistory.create({
        data: {
          userId,
          overallScore: scoreData.overallScore,
          githubScore: scoreData.githubScore,
          projectScore: scoreData.projectScore,
          skillScore: scoreData.skillScore,
          resumeScore: scoreData.resumeScore,
          deploymentScore: scoreData.deploymentScore,
        },
      });
    } else {
      await prisma.scoreHistory.update({
        where: { id: historyToday.id },
        data: {
          overallScore: scoreData.overallScore,
          githubScore: scoreData.githubScore,
          projectScore: scoreData.projectScore,
          skillScore: scoreData.skillScore,
          resumeScore: scoreData.resumeScore,
          deploymentScore: scoreData.deploymentScore,
        },
      });
    }

    const oldScore = currentDevScore?.overallScore ?? 0;
    const newScore = scoreData.overallScore;
    if (newScore > oldScore && oldScore > 0) {
      await createNotificationAction(
        userId,
        "Developer Score Improved!",
        `Your developer score increased from ${Math.round(oldScore)} to ${Math.round(newScore)}! Keep it up.`,
        "SCORE_IMPROVEMENT"
      );
    }

    return { success: true, data: scoreData };
  } catch (error) {
    console.error("Error calculating developer score:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Calculation failed",
    };
  }
}
