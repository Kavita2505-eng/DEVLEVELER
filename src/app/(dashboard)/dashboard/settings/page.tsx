import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getSettingsAction } from "@/actions/settings";
import { SettingsClient } from "@/components/dashboard/settings-client";

export default async function SettingsPage() {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    redirect("/login");
  }

  const res = await getSettingsAction();
  if (!res.success || !res.data) {
    return (
      <div className="flex h-64 items-center justify-center text-xs text-[var(--error)]">
        Failed to load settings. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)] md:text-2xl">
          Account Configurations
        </h2>
        <p className="text-sm text-[var(--foreground-secondary)]">
          Manage your public developer profile handles, custom skills, career path targets, and notifications.
        </p>
      </div>

      <SettingsClient initialSettings={res.data} />
    </div>
  );
}
