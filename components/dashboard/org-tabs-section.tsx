import { Suspense } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar, Users, Mail, Settings } from "lucide-react";
import prisma from "@/lib/prisma";
import { EventsTabContent } from "@/components/dashboard/events-tab-content";
// import { MembersTabContent } from "@/components/dashboard/members-tab-content";
// import { InvitationsTabContent } from "@/components/dashboard/invitations-tab-content";
// import { SettingsTabContent } from "@/components/dashboard/settings-tab-content";

import { EventsTabSkeleton } from "@/components/dashboard/events-tab-skeleton";
// import { MembersTabSkeleton } from "@/components/dashboard/skeletons/members-tab-skeleton";
// import { InvitationsTabSkeleton } from "@/components/dashboard/skeletons/invitations-tab-skeleton";

interface OrganizationTabsSectionProps {
  organizationId: string;
  organizationName: string;
  canManage: boolean;
  userId: string;
}

export const OrganizationTabsSection = async ({
  organizationId,
  organizationName,
  canManage,
  userId,
}: OrganizationTabsSectionProps) => {
  const [members, events] = await Promise.all([
    prisma.membership.count({
      where: { organizationId },
    }),
    prisma.eventAssignment.count({
      where: {
        user: { clerkId: userId },
        status: { in: ["PENDING", "ACCEPTED"] },
      },
    }),
  ]);

  return (
    <Tabs defaultValue="events" className="space-y-6">
      <TabsList className="inline-flex h-auto gap-1 rounded-xl bg-secondary/50 p-1 flex-wrap">
        <TabsTrigger
          value="events"
          className="cursor-pointer rounded-lg px-4 py-2.5 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
        >
          <Calendar className="mr-2 h-4 w-4" />
          Events
          <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-xs">
            {events}
          </span>
        </TabsTrigger>
        <TabsTrigger
          value="members"
          className="cursor-pointer rounded-lg px-4 py-2.5 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
        >
          <Users className="mr-2 h-4 w-4" />
          Members
          <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-xs">
            {members}
          </span>
        </TabsTrigger>
        {canManage && (
          <TabsTrigger
            value="invitations"
            className="cursor-pointer rounded-lg px-4 py-2.5 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
          >
            <Mail className="mr-2 h-4 w-4" />
            Invitations
          </TabsTrigger>
        )}
        {canManage && (
          <TabsTrigger
            value="settings"
            className="cursor-pointer rounded-lg px-4 py-2.5 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="events" className="mt-6">
        <Suspense fallback={<EventsTabSkeleton />}>
          <EventsTabContent
            organizationId={organizationId}
            userId={userId}
          />
        </Suspense>
      </TabsContent>

      <TabsContent value="members" className="mt-6">
        <p className="text-sm text-muted-foreground">Members content coming soon.</p>
      </TabsContent>

      {canManage && (
        <TabsContent value="invitations" className="mt-6">
          <p className="text-sm text-muted-foreground">Invitations content coming soon.</p>
        </TabsContent>
      )}

      {canManage && (
        <TabsContent value="settings" className="mt-6">
          <p className="text-sm text-muted-foreground">Settings content coming soon.</p>
        </TabsContent>
      )}
    </Tabs>
  );
};
