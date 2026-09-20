import { ChartSkeleton } from "@/components/dashboard/loading-skeleton";

export default function IntelligenceLoading() {
  return (
    <div className="space-y-6">
      <div className="skeleton h-8 w-64" />
      <div className="grid gap-6 md:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
      <ChartSkeleton />
    </div>
  );
}
