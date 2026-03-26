import { Suspense } from "react";
import { OrgTabNav } from "@/components/dashboard/org-tab-nav";
import prisma from "@/lib/prisma";
// import { EventsTabContent } from "@/components/dashboard/events-tab-content";
// import { MembersTabContent } from "@/components/dashboard/members-tab-content";
// import { InvitationsTabContent } from "@/components/dashboard/invitations-tab-content";
// import { SettingsTabContent } from "@/components/dashboard/settings-tab-content";

// import { EventsTabSkeleton } from "@/components/dashboard/skeletons/events-tab-skeleton";
// import { MembersTabSkeleton } from "@/components/dashboard/skeletons/members-tab-skeleton";
// import { InvitationsTabSkeleton } from "@/components/dashboard/skeletons/invitations-tab-skeleton";

interface OrganizationTabsSectionProps {
  organizationId: string;
  organizationName: string;
  canManage: boolean;
  activeTab: string;
}

export const OrganizationTabsSection = async ({
  organizationId,
  organizationName,
  canManage,
  activeTab,
}: OrganizationTabsSectionProps) => {

  const validTabs = ["events", "members", "invitations", "settings"];
  const tab = validTabs.includes(activeTab) ? activeTab : "events";


  const effectiveTab =
    (tab === "invitations" || tab === "settings") && !canManage
      ? "events"
      : tab;

  // TODO: Fetch counts for tab badges from service layer
  // const counts = await getTabCounts(organizationId);
  const counts = {
    events: 0,
    members: 0,
    invitations: 0,
  };

  const count = await prisma.membership.count({
    where: {
      organizationId
    },
  });

  return (
    <div className="space-y-6">
      <OrgTabNav
        activeTab={effectiveTab}
        canManage={canManage}
        counts={count}
      />

      {/* <div className="mt-6">
        {effectiveTab === "events" && (
          <Suspense fallback={<EventsTabSkeleton />}>
            <EventsTabContent
              organizationId={organizationId}
              canManage={canManage}
            />
          </Suspense>
        )}

        {effectiveTab === "members" && (
          <Suspense fallback={<MembersTabSkeleton />}>
            <MembersTabContent
              organizationId={organizationId}
              canManage={canManage}
            />
          </Suspense>
        )}

        {effectiveTab === "invitations" && canManage && (
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
        )}
      </div> */}
    </div>
  );
};