import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SkillsClient } from "@/components/dashboard/skills-client";
import type { SkillGapAnalysis, SkillItem, SkillRecommendation, SkillCategory } from "@/types";

export default async function SkillsPage() {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Fetch the latest skill gap analysis
  const skillGap = await prisma.skillGap.findFirst({
    where: { userId },
    orderBy: { analyzedAt: "desc" },
  });

  let initialAnalysis: SkillGapAnalysis | null = null;

  if (skillGap) {
    const currentSkills = JSON.parse(skillGap.currentSkills as string || "[]") as SkillItem[];
    const missingSkills = JSON.parse(skillGap.missingSkills as string || "[]") as SkillItem[];
    const recommendations = JSON.parse(skillGap.recommendations as string || "[]") as SkillRecommendation[];

    // Group currentSkills to construct the distribution
    const categories = Array.from(new Set(currentSkills.map((s) => s.category)));
    const skillDistribution: SkillCategory[] = categories.map((cat) => {
      const catSkills = currentSkills.filter((s) => s.category === cat);
      return {
        category: cat,
        skills: catSkills,
        coverage: Math.round(
          (catSkills.filter((s) => s.proficiency >= 60).length / Math.max(1, catSkills.length)) * 100
        ),
      };
    });

    initialAnalysis = {
      currentSkills,
      missingSkills,
      recommendations,
      skillDistribution,
    };
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)] md:text-2xl">
          Skill Gap Analysis
        </h2>
        <p className="text-sm text-[var(--foreground-secondary)]">
          Audit your stack, uncover coverages, and get guided roadmap recommendations.
        </p>
      </div>

      <SkillsClient initialAnalysis={initialAnalysis} userId={userId} />
    </div>
  );
}
