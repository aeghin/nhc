import { MemberEventsDashboard } from "@/components/dashboard/events-member-dashboard";
import { UpNextBanner } from "@/components/dashboard/up-next-banner";
import { getOrgServiceTypes } from "@/lib/services/service-types";
import { getUserEvents, getOrgEvents } from "@/lib/services/events";

interface EventsTabContentProps {
  organizationId: string;
  userId: string;
  canManage: boolean;
}

export const EventsTabContent = async ({
  organizationId,
  userId,
  canManage,
}: EventsTabContentProps) => {

  const [serviceTypes, events, allEvents] = await Promise.all([
    getOrgServiceTypes(organizationId),
    getUserEvents(organizationId, userId),
    canManage ? getOrgEvents(organizationId, userId) : Promise.resolve([]),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <UpNextBanner
        events={events}
        serviceTypes={serviceTypes}
        organizationId={organizationId}
      />

      <MemberEventsDashboard
        events={events}
        allEvents={allEvents}
        serviceTypes={serviceTypes}
        organizationId={organizationId}
        canManage={canManage}
      />
    </div>
  );
};
