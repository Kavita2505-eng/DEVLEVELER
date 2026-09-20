import { ChartSkeleton, CardSkeleton } from "@/components/dashboard/loading-skeleton";

export default function ProjectsLoading() {
  return (
    <div className="space-y-6">
      <div className="skeleton h-8 w-48" />
      <div className="skeleton h-12 w-full max-w-md" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    </div>
  );
}
