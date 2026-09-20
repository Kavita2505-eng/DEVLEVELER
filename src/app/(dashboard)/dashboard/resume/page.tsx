import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ResumeClient } from "@/components/dashboard/resume-client";
import type { ResumeAnalysis, EducationEntry, ExperienceEntry, ProjectEntry, ResumeSuggestion } from "@/types";

export default async function ResumePage() {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Fetch the latest resume analysis
  const resume = await prisma.resume.findFirst({
    where: { userId },
    orderBy: { analyzedAt: "desc" },
  });

  let initialAnalysis: ResumeAnalysis | null = null;

  if (resume) {
    initialAnalysis = {
      skills: JSON.parse(resume.skills as string || "[]") as string[],
      education: JSON.parse(resume.education as string || "[]") as EducationEntry[],
      experience: JSON.parse(resume.experience as string || "[]") as ExperienceEntry[],
      projects: JSON.parse(resume.projects as string || "[]") as ProjectEntry[],
      certifications: JSON.parse(resume.certifications as string || "[]") as string[],
      atsScore: resume.atsScore,
      qualityScore: resume.qualityScore,
      missingKeywords: JSON.parse(resume.missingKeywords as string || "[]") as string[],
      suggestions: JSON.parse(resume.suggestions as string || "[]") as ResumeSuggestion[],
      summary: resume.summary ?? "",
    };
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)] md:text-2xl">
          Resume Analysis
        </h2>
        <p className="text-sm text-[var(--foreground-secondary)]">
          ATS readability scoring and keyword optimization guidelines.
        </p>
      </div>

      <ResumeClient initialAnalysis={initialAnalysis} userId={userId} />
    </div>
  );
}
