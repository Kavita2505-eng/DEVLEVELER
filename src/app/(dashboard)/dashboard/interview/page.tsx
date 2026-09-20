import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { InterviewClient } from "@/components/dashboard/interview-client";
import type { InterviewQuestion } from "@/types";

export default async function InterviewPage() {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Fetch all user interview sessions
  const sessions = await prisma.interviewSession.findMany({
    where: { userId },
    orderBy: { generatedAt: "desc" },
  });

  // Map database format to the component interface
  const formattedSessions = sessions.map((s) => ({
    id: s.id,
    type: s.type as "hr" | "technical" | "project",
    difficulty: s.difficulty,
    skillFocus: (() => {
      try {
        if (typeof s.skillFocus === "string") {
          return JSON.parse(s.skillFocus) as string[];
        }
        return (s.skillFocus as unknown as string[]) || [];
      } catch {
        return [];
      }
    })(),
    generatedAt: s.generatedAt.toISOString(),
    questions: (() => {
      try {
        if (typeof s.questions === "string") {
          return JSON.parse(s.questions) as InterviewQuestion[];
        }
        return (s.questions as unknown as InterviewQuestion[]) || [];
      } catch {
        return [];
      }
    })(),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)] md:text-2xl">
          Interview Readiness
        </h2>
        <p className="text-sm text-[var(--foreground-secondary)]">
          Simulate coding sessions, project discussions, and HR questions tailored specifically to your profile.
        </p>
      </div>

      <InterviewClient pastSessions={formattedSessions} />
    </div>
  );
}
