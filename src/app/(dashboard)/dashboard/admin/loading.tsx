import { CardSkeleton } from "@/components/dashboard/loading-skeleton";

export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <div className="skeleton h-8 w-48" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <div className="card-base p-0 overflow-hidden">
        <div className="skeleton h-12 w-full border-b border-[var(--border)]" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border-b border-[var(--border)]/50 last:border-0">
            <div className="skeleton h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <div className="skeleton h-3 w-40" />
              <div className="skeleton h-2.5 w-24" />
            </div>
            <div className="skeleton h-6 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
