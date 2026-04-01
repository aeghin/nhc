import { MemberEventsDashboard } from "@/components/dashboard/events-member-dashboard";

// TODO: Replace with real service functions
// import { getEventsByOrganization } from "@/lib/services/event";
// import { getServiceTypesByOrganization } from "@/lib/services/service-type";

interface EventsTabContentProps {
  organizationId: string;
  userId: string;
}

export const EventsTabContent = async ({
  organizationId,
  userId
}: EventsTabContentProps) => {
  // TODO: Replace with real queries using "use cache" service functions
  // const [events, serviceTypes] = await Promise.all([
  //   getEventsByOrganization(organizationId),
  //   getServiceTypesByOrganization(organizationId),
  // ]);

  // Mock data — replace with real fetches
  const events: any[] = [];
  const serviceTypes: any[] = [];

  return (
    <MemberEventsDashboard
      events={events}
      serviceTypes={serviceTypes}
      organizationId={organizationId}
      userId={userId}
    />
  );
};