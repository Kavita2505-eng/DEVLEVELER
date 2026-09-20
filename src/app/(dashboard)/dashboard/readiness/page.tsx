import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ReadinessClient } from "@/components/dashboard/readiness-client";

export default async function ReadinessPage() {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Fetch past readiness analysis
  const readiness = await prisma.readinessAnalysis.findUnique({
    where: { userId },
  });

  const formattedReadiness = readiness
    ? {
        overallScore: readiness.overallScore,
        entryLevelScore: readiness.entryLevelScore,
        graduateScore: readiness.graduateScore,
        fullStackScore: readiness.fullStackScore,
        frontendScore: readiness.frontendScore,
        backendScore: readiness.backendScore,
        strongAreas: (() => {
          try {
            if (typeof readiness.strongAreas === "string") return JSON.parse(readiness.strongAreas) as string[];
            return (readiness.strongAreas as string[]) || [];
          } catch {
            return [];
          }
        })(),
        weakAreas: (() => {
          try {
            if (typeof readiness.weakAreas === "string") return JSON.parse(readiness.weakAreas) as string[];
            return (readiness.weakAreas as string[]) || [];
          } catch {
            return [];
          }
        })(),
        missingRequirements: (() => {
          try {
            if (typeof readiness.missingRequirements === "string") return JSON.parse(readiness.missingRequirements) as string[];
            return (readiness.missingRequirements as string[]) || [];
          } catch {
            return [];
          }
        })(),
        recommendations: (() => {
          try {
            if (typeof readiness.recommendations === "string") return JSON.parse(readiness.recommendations) as string[];
            return (readiness.recommendations as string[]) || [];
          } catch {
            return [];
          }
        })(),
        priorities: (() => {
          try {
            if (typeof readiness.priorities === "string") return JSON.parse(readiness.priorities) as string[];
            return (readiness.priorities as string[]) || [];
          } catch {
            return [];
          }
        })(),
      }
    : null;

  return <ReadinessClient initialReadiness={formattedReadiness} />;
}
