import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const InvitationsTabSkeleton = () => (
  <Card className="overflow-hidden rounded-xl border-border/40 bg-linear-to-br from-card to-card/80 shadow-sm">
    <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 bg-secondary/20 px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-xl bg-muted" />
        <div className="space-y-2">
          <div className="h-4 w-24 animate-pulse rounded-md bg-muted" />
          <div className="h-3 w-20 animate-pulse rounded-md bg-muted" />
        </div>
      </div>
      <div className="h-9 w-28 animate-pulse rounded-md bg-muted" />
    </CardHeader>
    <CardContent className="p-0">
      <div className="divide-y divide-border/40">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-4 px-6 py-4"
          >
            <div className="flex items-center gap-4">
              <div className="h-11 w-11 shrink-0 animate-pulse rounded-xl bg-muted" />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-44 animate-pulse rounded-md bg-muted" />
                  <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
                </div>
                <div className="h-3 w-32 animate-pulse rounded-md bg-muted" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-3 w-12 animate-pulse rounded-md bg-muted" />
              <div className="h-8 w-8 animate-pulse rounded-md bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);