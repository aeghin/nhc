import { Skeleton } from "@/components/ui/skeleton";

export const MembersTabSkeleton = () => (
  <div className="space-y-6">
    {/* Search Bar */}
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <Skeleton className="h-10 max-w-sm flex-1" />
    </div>

    {/* Role Filter Tabs */}
    <div className="flex items-center gap-2">
      <div className="flex rounded-lg border border-border bg-background p-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-8 rounded-md"
            style={{ width: `${60 + i * 10}px` }}
          />
        ))}
      </div>
    </div>

    {/* Member Cards */}
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-lg border border-border bg-card p-4"
        >
          {/* Avatar */}
          <Skeleton className="h-10 w-10 rounded-full" />

          {/* Member Info */}
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-48" />
            <div className="flex gap-1">
              <Skeleton className="h-5 w-16 rounded-md" />
              <Skeleton className="h-5 w-20 rounded-md" />
            </div>
          </div>

          {/* Join Date */}
          <div className="hidden space-y-1 text-right sm:block">
            <Skeleton className="ml-auto h-3 w-12" />
            <Skeleton className="ml-auto h-4 w-16" />
          </div>
        </div>
      ))}
    </div>

    {/* Summary Footer */}
    <div className="flex items-center justify-between border-t border-border pt-4">
      <Skeleton className="h-4 w-40" />
    </div>
  </div>
);
