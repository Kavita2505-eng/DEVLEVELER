import { CardSkeleton } from "@/components/dashboard/loading-skeleton";

export default function CareerCoachLoading() {
  return (
    <div className="space-y-6">
      <div className="skeleton h-8 w-48" />
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <div className="card-base p-6 space-y-4">
        <div className="skeleton h-5 w-32" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-16 w-full" />
          ))}
        </div>
        <div className="skeleton h-10 w-full" />
      </div>
    </div>
  );
}
