import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProjectsClient } from "@/components/dashboard/projects-client";

interface ProjectRoadmapStep {
  week: number;
  title: string;
  description: string;
}

export default async function ProjectsPage() {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Fetch past project analyses
  const pastAnalyses = await prisma.projectAnalysis.findMany({
    where: { userId },
    orderBy: { analyzedAt: "desc" },
  });

  const formattedAnalyses = pastAnalyses.map((p) => ({
    id: p.id,
    repoUrl: p.repoUrl,
    overallScore: p.overallScore,
    architectureScore: p.architectureScore,
    documentationScore: p.documentationScore,
    maintainabilityScore: p.maintainabilityScore,
    deploymentScore: p.deploymentScore,
    documentationQuality: p.documentationQuality ?? undefined,
    readmeQuality: p.readmeQuality ?? undefined,
    projectStructure: p.projectStructure ?? undefined,
    folderOrganization: p.folderOrganization ?? undefined,
    scalability: p.scalability ?? undefined,
    maintainability: p.maintainability ?? undefined,
    codeComplexity: p.codeComplexity ?? undefined,
    deploymentStatus: p.deploymentStatus ?? undefined,
    strengths: (() => {
      try {
        if (typeof p.strengths === "string") return JSON.parse(p.strengths) as string[];
        return (p.strengths as string[]) || [];
      } catch {
        return [];
      }
    })(),
    weaknesses: (() => {
      try {
        if (typeof p.weaknesses === "string") return JSON.parse(p.weaknesses) as string[];
        return (p.weaknesses as string[]) || [];
      } catch {
        return [];
      }
    })(),
    recommendations: (() => {
      try {
        if (typeof p.recommendations === "string") return JSON.parse(p.recommendations) as string[];
        return (p.recommendations as string[]) || [];
      } catch {
        return [];
      }
    })(),
    improvementRoadmap: (() => {
      try {
        if (typeof p.improvementRoadmap === "string") return JSON.parse(p.improvementRoadmap) as ProjectRoadmapStep[];
        return (p.improvementRoadmap as unknown as ProjectRoadmapStep[]) || [];
      } catch {
        return [];
      }
    })(),
    analyzedAt: p.analyzedAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)] md:text-2xl">
          Project Analyzer
        </h2>
        <p className="text-sm text-[var(--foreground-secondary)]">
          Audit documentation standards, directory hierarchies, dependency configurations, and scalability design patterns.
        </p>
      </div>

      <ProjectsClient initialAnalyses={formattedAnalyses} />
    </div>
  );
}
