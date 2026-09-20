import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BillingClient } from "@/components/dashboard/billing-client";

export default async function BillingPage() {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true, isEarlyAdopter: true, premiumExpiresAt: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)] md:text-2xl">
          Billing & Subscriptions
        </h2>
        <p className="text-sm text-[var(--foreground-secondary)]">
          Manage your subscription plans and unlock pro platform features.
        </p>
      </div>

      <BillingClient 
        currentPlan={user?.plan ?? "FREE"} 
        isEarlyAdopter={user?.isEarlyAdopter ?? false}
        premiumExpiresAt={user?.premiumExpiresAt?.toISOString() ?? null}
      />
    </div>
  );
}
