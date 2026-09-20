import { CardSkeleton } from "@/components/dashboard/loading-skeleton";

export default function RecruiterLoading() {
  return (
    <div className="space-y-6">
      <div className="skeleton h-8 w-48" />
      <div className="flex gap-3">
        <div className="skeleton h-10 w-full max-w-sm" />
        <div className="skeleton h-10 w-24" />
        <div className="skeleton h-10 w-24" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
