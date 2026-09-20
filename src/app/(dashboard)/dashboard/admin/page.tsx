import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAdminStatsAction } from "@/actions/admin";
import { AdminClient } from "@/components/dashboard/admin-client";

export default async function AdminPage() {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    redirect("/login");
  }

  // Retrieve user role from database
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="card-base p-12 text-center space-y-4 max-w-md mx-auto mt-12">
        <h2 className="text-lg font-bold text-[var(--foreground)]">Access Restricted</h2>
        <p className="text-xs text-[var(--foreground-secondary)] leading-relaxed">
          The Admin Dashboard is restricted to administrator accounts. You can upgrade your testing role to Administrator on the Settings page to view this dashboard.
        </p>
      </div>
    );
  }

  // Fetch admin overview stats
  const statsRes = await getAdminStatsAction();
  if (!statsRes.success || !statsRes.data) {
    return (
      <div className="card-base p-12 text-center text-xs text-[var(--error)]">
        {statsRes.error ?? "Failed to load administrator statistics."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)] md:text-2xl">
          Platform Admin Analytics
        </h2>
        <p className="text-sm text-[var(--foreground-secondary)]">
          Monitor user growth, developer analyses scans count, and modify account capabilities for testing.
        </p>
      </div>

      <AdminClient initialStats={statsRes.data} />
    </div>
  );
}
