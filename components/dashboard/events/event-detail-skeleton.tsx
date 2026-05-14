import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function EventDetailSkeleton() {
  return (
    <main className="mx-auto max-w-screen-2xl px-6 py-8">
      <div className="space-y-8">
        <Skeleton className="h-4 w-40" />

        <div className="rounded-2xl border border-border/40 border-l-[3px] border-l-muted bg-card p-8">
          <div className="flex items-start gap-5">
            <Skeleton className="h-16 w-16 rounded-2xl" />
            <div className="space-y-3">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-9 w-72" />
              <Skeleton className="h-4 w-80" />
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <Skeleton className="h-4 w-16" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-1.5 w-full mt-2" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
