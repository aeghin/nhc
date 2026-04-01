export const EventsTabSkeleton = () => (
  <div className="space-y-6">
    {/* Pending / Schedule tabs */}
    <div className="flex gap-8 border-b border-border">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2 pb-3">
          <div className="h-2 w-2 animate-pulse rounded-full bg-muted" />
          <div
            className="h-4 animate-pulse rounded-md bg-muted"
            style={{ width: `${60 + i * 20}px` }}
          />
          <div className="h-5 w-8 animate-pulse rounded-full bg-muted" />
        </div>
      ))}
    </div>

    {/* Time scope buttons */}
    <div className="flex items-center gap-2">
      <div className="flex rounded-lg border border-border bg-background p-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-8 animate-pulse rounded-md bg-muted"
            style={{ width: `${70 + i * 5}px` }}
          />
        ))}
      </div>
    </div>

    {/* Service type filter chips */}
    <div className="flex gap-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-8 animate-pulse rounded-full bg-muted"
          style={{ width: `${50 + i * 15}px` }}
        />
      ))}
    </div>

    {/* Event cards */}
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg border border-border border-l-[3px] border-l-muted bg-card p-4"
        >
          <div className="mb-3 flex items-start justify-between">
            <div className="h-6 w-20 animate-pulse rounded bg-muted" />
            <div className="h-6 w-24 animate-pulse rounded-md bg-muted" />
          </div>
          <div className="mb-2 h-5 w-48 animate-pulse rounded-md bg-muted" />
          <div className="flex gap-4">
            <div className="h-4 w-24 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-16 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-32 animate-pulse rounded-md bg-muted" />
          </div>
        </div>
      ))}
    </div>
  </div>
);