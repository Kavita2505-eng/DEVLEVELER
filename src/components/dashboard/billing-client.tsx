"use client";

import { useState } from "react";
import { updateUserPlanAction } from "@/actions/billing";
import { CheckCircle2, Sparkles, Loader2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface BillingClientProps {
  currentPlan: string;
  isEarlyAdopter: boolean;
  premiumExpiresAt: Date | string | null;
}

const PLANS = [
  {
    id: "FREE",
    dbPlan: "FREE",
    name: "Free",
    price: "$0",
    description: "Essential developer intelligence to get started.",
    features: [
      "GitHub Analysis",
      "Resume Analysis",
      "Developer Score",
      "Skill Gap Analysis",
      "Dashboard & Weekly Goals",
      "Basic Portfolio Analysis",
      "Basic Developer Intelligence",
      "XP & Achievements",
    ],
  },
  {
    id: "PRO",
    dbPlan: "PRO",
    name: "Founding Pro",
    price: "$3",
    description: "Complete career intelligence with unlimited AI-powered insights.",
    features: [
      "Everything in Free",
      "Unlimited AI Analysis",
      "AI Career Coach",
      "AI Career Roadmap",
      "AI Interview Readiness",
      "Advanced Developer Intelligence",
      "Advanced Portfolio Analysis",
      "Deep GitHub Repository Analysis",
      "Export Intelligence Dossier",
      "Priority Processing",
      "Machined Precision Intelligence UI",
      "Early Access Features",
    ],
    popular: true,
  },
];

export function BillingClient({ currentPlan, isEarlyAdopter, premiumExpiresAt }: BillingClientProps) {
  const router = useRouter();
  const [activePlan, setActivePlan] = useState(currentPlan);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePlanChange = async (plan: "FREE" | "PRO") => {
    if (isEarlyAdopter) return;
    if (plan === activePlan) return;
    setLoadingPlan(plan);
    setError(null);
    try {
      const res = await updateUserPlanAction(plan);
      if (res.success) {
        setActivePlan(plan);
        router.refresh();
      } else {
        setError(res.error ?? "Failed to update subscription tier.");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoadingPlan(null);
    }
  };

  const getSubStatus = () => {
    if (activePlan !== "PRO") return "FREE";
    if (!premiumExpiresAt) return "ACTIVE";

    const expiry = new Date(premiumExpiresAt).getTime();
    const now = Date.now();

    if (expiry < now) return "EXPIRED";

    const remainingDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    if (remainingDays <= 30) return "EXPIRING SOON";

    return "ACTIVE";
  };

  const status = getSubStatus();

  const formattedExpiry = premiumExpiresAt
    ? new Date(premiumExpiresAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700 shadow-xs">
          <span>{error}</span>
        </div>
      )}

      {/* Early Adopter Banner */}
      {isEarlyAdopter && (
        <div className="p-6 rounded-2xl bg-surface-container-lowest border border-primary/30 shadow-xs relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-fixed text-primary shrink-0">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface">
                  Founding Developer Edition
                </span>
                <span className="rounded-full bg-secondary-fixed text-on-secondary-fixed px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  Tier 5/5
                </span>
                {status === "ACTIVE" && (
                  <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    Active
                  </span>
                )}
                {status === "EXPIRING SOON" && (
                  <span className="rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider animate-pulse">
                    Expiring Soon
                  </span>
                )}
                {status === "EXPIRED" && (
                  <span className="rounded-full bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    Expired
                  </span>
                )}
              </div>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                You have unlocked DevLeveler Pro completely free for 6 months as one of our first 5 Founding Developers.
              </p>
            </div>
          </div>
          <div className="sm:text-right shrink-0 pt-3 sm:pt-0 w-full sm:w-auto border-t border-outline-variant/30 sm:border-0">
            <span className="text-[10px] font-mono uppercase font-bold text-on-surface-variant tracking-wider block mb-0.5">
              Access Granted Until
            </span>
            <span className="text-xs font-mono font-bold text-primary">
              {formattedExpiry ?? "Permanent Early Access"}
            </span>
          </div>
        </div>
      )}

      {/* Plan Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {PLANS.map((plan) => {
          let isPlanActive = false;
          if (isEarlyAdopter) {
            isPlanActive = plan.id === "PRO";
          } else {
            isPlanActive = activePlan === plan.id;
          }

          return (
            <div
              key={plan.id}
              className={cn(
                "p-6 rounded-2xl bg-surface-container-lowest flex flex-col justify-between relative overflow-hidden transition-all shadow-xs border",
                isPlanActive && plan.id === "PRO"
                  ? "border-primary/50 ring-1 ring-primary/20 shadow-md"
                  : "border-outline-variant/40 hover:border-outline-variant"
              )}
            >
              {isPlanActive && (
                <div className="absolute right-0 top-0 bg-primary-container text-white px-3 py-1 rounded-bl-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                  <Sparkles className="h-3 w-3" />
                  <span>{isEarlyAdopter ? "Founding Dev Active" : "Active Plan"}</span>
                </div>
              )}

              {!isPlanActive && plan.popular && (
                <div className="absolute right-0 top-0 bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-bl-xl text-[10px] font-bold uppercase tracking-wider">
                  Popular
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <h3 className={cn(
                    "text-base font-bold font-headline flex items-center gap-1.5",
                    plan.id === "PRO" ? "text-primary" : "text-on-surface"
                  )}>
                    {plan.name}
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-1">
                    {plan.description}
                  </p>
                </div>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold tracking-tight text-on-surface font-headline">{plan.price}</span>
                  <span className="text-xs text-on-surface-variant font-medium">/ 6 months</span>
                </div>

                <hr className="border-outline-variant/30" />

                <ul className="space-y-2.5">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-on-surface-variant">
                      <CheckCircle2 className={cn(
                        "h-4 w-4 shrink-0 mt-0.5",
                        plan.id === "PRO" ? "text-primary" : "text-outline"
                      )} />
                      <span className="leading-tight">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handlePlanChange(plan.dbPlan as "FREE" | "PRO")}
                disabled={isEarlyAdopter || isPlanActive || loadingPlan !== null}
                className={cn(
                  "w-full mt-8 h-10 rounded-xl text-xs font-semibold flex items-center justify-center transition-all cursor-pointer",
                  isPlanActive
                    ? "bg-surface-container-low text-on-surface-variant border border-outline-variant/30 cursor-default"
                    : isEarlyAdopter
                    ? "bg-surface-container-low text-outline border border-outline-variant/30 cursor-not-allowed"
                    : plan.id === "PRO"
                    ? "bg-primary-container text-white shadow-sm hover:opacity-95"
                    : "border border-outline-variant/50 text-on-surface hover:bg-surface-container-low"
                )}
              >
                {loadingPlan === plan.dbPlan ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isPlanActive ? (
                  isEarlyAdopter ? "Founding Developer (Included)" : "Current Plan"
                ) : isEarlyAdopter ? (
                  "Pro Tier Active"
                ) : plan.id === "PRO" ? (
                  `Upgrade to ${plan.name}`
                ) : (
                  `Select ${plan.name}`
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
