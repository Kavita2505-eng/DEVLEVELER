import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { CoachClient } from "@/components/dashboard/coach-client";
import { getCareerCoachInsightsAction } from "@/actions/coach";

export default async function CareerCoachPage() {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    redirect("/login");
  }

  // Attempt to load initial insights
  let initialInsights = null;
  try {
    const res = await getCareerCoachInsightsAction();
    if (res.success && res.data) {
      initialInsights = res.data;
    }
  } catch (error) {
    console.error("Failed to load initial coach insights:", error);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)] md:text-2xl">
          Career Coach
        </h2>
        <p className="text-sm text-[var(--foreground-secondary)]">
          Structured developer insights and context-aware technical recommendations.
        </p>
      </div>

      <CoachClient initialInsights={initialInsights} />
    </div>
  );
}
