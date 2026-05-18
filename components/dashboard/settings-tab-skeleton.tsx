import { Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const SettingsTabSkeleton = () => {
  return (
    <Card className="overflow-hidden rounded-xl border-border/40 bg-linear-to-br from-card to-card/80 shadow-sm">
      <CardHeader className="border-b border-border/40 bg-secondary/20 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">
              Organization Settings
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage your organization details
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <dl className="divide-y divide-border/40">
          <div className="grid grid-cols-1 gap-2 py-4 md:grid-cols-[200px_1fr] md:items-center md:gap-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-48" />
          </div>
          <div className="grid grid-cols-1 gap-2 py-4 md:grid-cols-[200px_1fr] md:items-start md:gap-4">
            <Skeleton className="h-4 w-24" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full max-w-md" />
              <Skeleton className="h-4 w-2/3 max-w-sm" />
            </div>
          </div>
        </dl>

        <div className="mt-2 flex gap-3 border-t border-border/40 pt-6">
          <Skeleton className="h-10 w-28 rounded-md" />
          <Skeleton className="h-10 w-44 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
};