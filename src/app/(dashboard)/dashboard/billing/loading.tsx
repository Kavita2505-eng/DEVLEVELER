export default function BillingLoading() {
  return (
    <div className="space-y-6">
      <div className="skeleton h-8 w-48" />
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="card-base p-6 space-y-4">
            <div className="skeleton h-5 w-24" />
            <div className="skeleton h-8 w-16" />
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="skeleton h-3 w-full" />
              ))}
            </div>
            <div className="skeleton h-10 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
