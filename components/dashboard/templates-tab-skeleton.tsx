import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const TemplatesTabSkeleton = () => (
  <Card className="overflow-hidden rounded-xl border-border/40 bg-linear-to-br from-card to-card/80 shadow-sm">
    <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 bg-secondary/20 px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-xl bg-muted" />
        <div className="space-y-2">
          <div className="h-4 w-32 animate-pulse rounded-md bg-muted" />
          <div className="h-3 w-20 animate-pulse rounded-md bg-muted" />
        </div>
      </div>
      <div className="h-9 w-32 animate-pulse rounded-md bg-muted" />
    </CardHeader>
    <CardContent className="p-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="space-y-3 rounded-xl border border-border/40 p-4"
          >
            <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
            <div className="h-4 w-36 animate-pulse rounded-md bg-muted" />
            <div className="h-3 w-28 animate-pulse rounded-md bg-muted" />
            <div className="h-3 w-32 animate-pulse rounded-md bg-muted" />
            <div className="h-8 w-full animate-pulse rounded-md bg-muted" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);
