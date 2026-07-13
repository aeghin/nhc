import { Card, CardContent } from "@/components/ui/card"

export const StatsGridSkeleton = () => (
  <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <Card
        key={i}
        className="overflow-hidden rounded-xl border-border/40 bg-linear-to-br from-card to-card/80 shadow-sm"
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-3.5 w-20 animate-pulse rounded-md bg-muted" />
              <div className="h-7 w-12 animate-pulse rounded-md bg-muted" />
              <div className="h-3 w-28 animate-pulse rounded-md bg-muted" />
            </div>
            <div className="h-10 w-10 animate-pulse rounded-xl bg-muted" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
)
