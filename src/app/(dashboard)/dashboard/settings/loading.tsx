export default function SettingsLoading() {
  return (
    <div className="space-y-6">
      <div className="skeleton h-8 w-48" />
      <div className="card-base p-6 space-y-5">
        <div className="skeleton h-5 w-32" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <div className="skeleton h-3 w-16" />
            <div className="skeleton h-10 w-full" />
          </div>
          <div className="space-y-1.5">
            <div className="skeleton h-3 w-16" />
            <div className="skeleton h-10 w-full" />
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="skeleton h-3 w-16" />
          <div className="skeleton h-20 w-full" />
        </div>
      </div>
      <div className="card-base p-6 space-y-5">
        <div className="skeleton h-5 w-32" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="skeleton h-10 w-full" />
          <div className="skeleton h-10 w-full" />
        </div>
        <div className="skeleton h-10 w-full" />
      </div>
    </div>
  );
}
