export default function RankingsLoading() {
  return (
    <div className="space-y-6">
      <div className="skeleton h-8 w-48" />
      <div className="skeleton h-10 w-full max-w-sm" />
      <div className="card-base p-0 overflow-hidden">
        <div className="skeleton h-12 w-full border-b border-[var(--border)]" />
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border-b border-[var(--border)]/50 last:border-0">
            <div className="skeleton h-6 w-8" />
            <div className="skeleton h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <div className="skeleton h-3 w-32" />
              <div className="skeleton h-2.5 w-20" />
            </div>
            <div className="skeleton h-6 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}
