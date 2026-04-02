import { MemberEventsDashboard } from "@/components/dashboard/events-member-dashboard";
import prisma from "@/lib/prisma";

// TODO: Replace with real service functions
// import { getEventsByOrganization } from "@/lib/services/event";
// import { getServiceTypesByOrganization } from "@/lib/services/service-type";

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
  
  const events: any[] = [];


  const serviceTypes = await prisma.serviceType.findMany({
    where: {
      organizationId
    },
    select: {
      id: true,
      name: true,
      color: true
    }
  });

  const getUserEvents = await prisma.event.findMany({
    where: {
      organizationId,
    },
    include: {
      assignments: {
        where: {
          user: {
            clerkId: userId
          }
        }
      }
    }
  });

  console.log(serviceTypes);


  return (
    <MemberEventsDashboard
      events={events}
      serviceTypes={serviceTypes}
      organizationId={organizationId}
      userId={userId}
      canManage={canManage}
    />
  );
};