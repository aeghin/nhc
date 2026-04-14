import { MemberEventsDashboard } from "@/components/dashboard/events-member-dashboard";
import { getOrgServiceTypes } from "@/lib/services/service-types";
import { getUserEvents } from "@/lib/services/events";

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
  
  const [serviceTypes, events] = await Promise.all([
    getOrgServiceTypes(organizationId),
    getUserEvents(organizationId, userId)
  ]);

  return (
    <MemberEventsDashboard
      events={events}
      serviceTypes={serviceTypes}
      organizationId={organizationId}
      canManage={canManage}
    />
  );
};
