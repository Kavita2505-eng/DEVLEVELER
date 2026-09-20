import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PortfolioClient } from "@/components/dashboard/portfolio-client";
import type { PortfolioAnalysisData, PortfolioRecommendation } from "@/types";

export default async function PortfolioPage() {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Fetch user latest portfolio analysis
  const saved = await prisma.portfolioAnalysis.findFirst({
    where: { userId },
    orderBy: { analyzedAt: "desc" },
  });

  let initialAnalysis: PortfolioAnalysisData | null = null;

  if (saved) {
    initialAnalysis = {
      url: saved.url,
      performanceScore: saved.performanceScore,
      seoScore: saved.seoScore,
      mobileScore: saved.mobileScore,
      designScore: saved.designScore,
      accessibilityScore: saved.accessScore,
      recommendations: JSON.parse(saved.recommendations as string || "[]") as PortfolioRecommendation[],
    };
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)] md:text-2xl">
          Portfolio Web Analysis
        </h2>
        <p className="text-sm text-[var(--foreground-secondary)]">
          Audit PageSpeed, mobile readiness, design quality, and SEO tags.
        </p>
      </div>

      <PortfolioClient initialAnalysis={initialAnalysis} />
    </div>
  );
}
