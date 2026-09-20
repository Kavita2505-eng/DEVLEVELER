import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { RoadmapClient } from "@/components/dashboard/roadmap-client";
import type { RoadmapData, RoadmapGoal, ProjectIdea } from "@/types";

export default async function RoadmapPage() {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Fetch latest active roadmap
  const savedRoadmap = await prisma.roadmap.findFirst({
    where: { userId, status: "active" },
    orderBy: { generatedAt: "desc" },
  });

  let initialRoadmap: RoadmapData | null = null;

  if (savedRoadmap) {
    initialRoadmap = {
      id: savedRoadmap.id,
      title: savedRoadmap.title,
      weeklyGoals: JSON.parse(savedRoadmap.weeklyGoals as string || "[]") as RoadmapGoal[],
      monthlyGoals: JSON.parse(savedRoadmap.monthlyGoals as string || "[]") as RoadmapGoal[],
      projectIdeas: JSON.parse(savedRoadmap.projectIdeas as string || "[]") as ProjectIdea[],
      techStack: JSON.parse(savedRoadmap.techStack as string || "[]") as string[],
      status: "active",
    };
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)] md:text-2xl">
          Personalized Career Roadmap
        </h2>
        <p className="text-sm text-[var(--foreground-secondary)]">
          Actionable 12-week learning path focused on scaling your tech stack.
        </p>
      </div>

      <RoadmapClient initialRoadmap={initialRoadmap} />
    </div>
  );
}
