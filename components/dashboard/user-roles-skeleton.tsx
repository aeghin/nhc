import { Card, CardContent } from "@/components/ui/card";

export const UserRolesSkeleton = () => (
  <Card className="overflow-hidden rounded-xl border-border/40 bg-linear-to-br from-card to-card/80 shadow-sm">
    <CardContent className="p-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-xl bg-muted" />
        <div className="space-y-2">
          <div className="h-4 w-32 animate-pulse rounded-md bg-muted" />
          <div className="h-3 w-48 animate-pulse rounded-md bg-muted" />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-7 w-20 animate-pulse rounded-full bg-muted"
          />
        ))}
      </div>
    </CardContent>
  </Card>
)