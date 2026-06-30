import { MemberEventsDashboard } from "@/components/dashboard/events-member-dashboard";
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
    <MemberEventsDashboard
      events={events}
      allEvents={allEvents}
      serviceTypes={serviceTypes}
      organizationId={organizationId}
      canManage={canManage}
    />
  );
};
