import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getRecruiterOverviewAction } from "@/actions/recruiter";
import { RecruiterClient } from "@/components/dashboard/recruiter-client";

export default async function RecruiterPage() {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    redirect("/login");
  }

  // Retrieve user role from database
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || (user.role !== "RECRUITER" && user.role !== "ADMIN")) {
    return (
      <div className="card-base p-12 text-center space-y-4 max-w-md mx-auto mt-12">
        <h2 className="text-lg font-bold text-[var(--foreground)]">Access Restricted</h2>
        <p className="text-xs text-[var(--foreground-secondary)] leading-relaxed">
          The Recruiter Portal is restricted to recruiter accounts. You can upgrade your testing role to Recruiter or Administrator on the Settings page to view this dashboard.
        </p>
      </div>
    );
  }

  // Fetch overview metadata
  const overviewRes = await getRecruiterOverviewAction();
  const trendingSkills = overviewRes.success && overviewRes.data
    ? overviewRes.data.commonSkills
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)] md:text-2xl">
          Recruiter Talent Portal
        </h2>
        <p className="text-sm text-[var(--foreground-secondary)]">
          Search and filter vetted candidate profiles by developer levels, score tiers, and custom skills.
        </p>
      </div>

      <RecruiterClient initialTrendingSkills={trendingSkills} />
    </div>
  );
}
