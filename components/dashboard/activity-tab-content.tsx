import { Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityRow } from "@/components/dashboard/activity-row";
import { LoadMoreActivity } from "@/components/dashboard/load-more-activity";
import { getOrganizationActivity } from "@/lib/services/activity";

interface ActivityTabContentProps {
  organizationId: string;
}

export const ActivityTabContent = async ({
  organizationId,
}: ActivityTabContentProps) => {
  const { items, nextCursor } = await getOrganizationActivity(organizationId);

  return (
    <Card className="overflow-hidden rounded-xl border-border/40 bg-linear-to-br from-card to-card/80 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 bg-secondary/20 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">
              Activity
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Only owners and admins can see this feed
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {items.length === 0 ? (
          <div className="flex h-50 flex-col items-center justify-center gap-2 text-muted-foreground">
            <Activity className="h-10 w-10 opacity-20" />
            <p className="text-sm">No activity yet</p>
            <p className="text-xs">
              Events, invitations, and member changes will show up here
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {items.map((item, i) => (
              <ActivityRow key={item.id} item={item} index={i} />
            ))}
            {nextCursor && (
              <LoadMoreActivity
                organizationId={organizationId}
                initialCursor={nextCursor}
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
