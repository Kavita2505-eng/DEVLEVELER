import { ChartSkeleton } from "@/components/dashboard/loading-skeleton";

export default function RoadmapLoading() {
  return (
    <div className="space-y-6">
      <div className="skeleton h-8 w-48" />
      <ChartSkeleton />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton h-16 w-full" />
        ))}
      </div>
    </div>
  );
}
