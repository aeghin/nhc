import { Suspense } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar, Users, Mail, Settings } from "lucide-react";
import prisma from "@/lib/prisma";
import { EventsTabContent } from "@/components/dashboard/events-tab-content";
import { MembersTabWrapper } from "@/components/dashboard/members-tab-wrapper";
// import { InvitationsTabContent } from "@/components/dashboard/invitations-tab-content";
// import { SettingsTabContent } from "@/components/dashboard/settings-tab-content";
import { OrgTabNav } from "./org-tab-nav";
import { EventsTabSkeleton } from "@/components/dashboard/events-tab-skeleton";
import { MembersTabSkeleton } from "@/components/dashboard/members-tab-skeleton";
// import { InvitationsTabSkeleton } from "@/components/dashboard/skeletons/invitations-tab-skeleton";

import { getOrgMemberCountById } from "@/lib/services/organization";
import { userEventsTotalCount } from "@/lib/services/events";

interface OrganizationTabsSectionProps {
  organizationId: string;
  organizationName: string;
  canManage: boolean;
  userId: string;
  activeTab: string;
}

export const OrganizationTabsSection = async ({
  organizationId,
  organizationName,
  canManage,
  userId,
  activeTab,
}: OrganizationTabsSectionProps) => {
  const validTabs = ["events", "members", "invitations", "settings"];
  const tab = validTabs.includes(activeTab) ? activeTab : "events";
 
  
  const effectiveTab =
    (tab === "invitations" || tab === "settings") && !canManage
      ? "events"
      : tab;
 
    const [totalEventsCount, totalMembersCount] = await Promise.all([
      userEventsTotalCount(userId, organizationId),
      getOrgMemberCountById(organizationId)
    ]);

    const counts = {
      events: totalEventsCount,
      members: totalMembersCount
    };

  return (
    <div className="space-y-6">
      <OrgTabNav
        activeTab={effectiveTab}
        canManage={canManage}
        counts={counts}
      />
 
      <div className="mt-6">
        {effectiveTab === "events" && (
          <Suspense fallback={<EventsTabSkeleton />}>
            <EventsTabContent
              organizationId={organizationId}
              canManage={canManage}
              userId={userId}
            />
          </Suspense>
        )}
 
        {effectiveTab === "members" && (
          <Suspense fallback={<MembersTabSkeleton />}>
            <MembersTabWrapper
              organizationId={organizationId}
              canManage={canManage}
            />
          </Suspense>
        )}
 
        {/* {effectiveTab === "invitations" && canManage && (
          <Suspense fallback={<InvitationsTabSkeleton />}>
            <InvitationsTabContent
              organizationId={organizationId}
              organizationName={organizationName}
              canManage={canManage}
            />
          </Suspense>
        )}
 
        {effectiveTab === "settings" && canManage && (
          <SettingsTabContent
            organizationId={organizationId}
            organizationName={organizationName}
          />
        )} */}
      </div>
    </div>
  );
};
