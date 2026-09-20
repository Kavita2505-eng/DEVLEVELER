import { CardSkeleton, ChartSkeleton } from "@/components/dashboard/loading-skeleton";

export default function ReadinessLoading() {
  return (
    <div className="space-y-6">
      <div className="skeleton h-8 w-48" />
      <div className="flex justify-center">
        <div className="skeleton h-40 w-40 rounded-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <ChartSkeleton />
    </div>
  );
}
