import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getLeaderboardAction } from "@/actions/leaderboard";
import { RankingsClient } from "@/components/dashboard/rankings-client";

export default async function RankingsPage() {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    redirect("/login");
  }

  const res = await getLeaderboardAction();
  if (!res.success || !res.data) {
    return (
      <div className="flex h-64 items-center justify-center text-xs text-[var(--error)]">
        Failed to load leaderboard data. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)] md:text-2xl">
          Developer Rankings
        </h2>
        <p className="text-sm text-[var(--foreground-secondary)]">
          Compare your Developer Score and XP levels against the global developer community.
        </p>
      </div>

      <RankingsClient
        entries={res.data.entries}
        currentUser={res.data.currentUser}
        currentUserId={session.user.id}
      />
    </div>
  );
}
