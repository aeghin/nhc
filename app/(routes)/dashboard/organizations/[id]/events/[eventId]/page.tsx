
import { notFound } from "next/navigation";
// import {
//   getEventById,
//   getOrganizationById,
//   getCurrentUser,
//   getServiceTypesByOrganization,
// } from "@/lib/services/data"
// import { EventHeader } from "@/components/dashboard/events/event-header";
// import { EventDetailsCard } from "@/components/dashboard/events/event-details-card";
// import { EventSetlistSection } from "@/components/dashboard/events/event-setlist-section";
// import { EventVolunteersSection } from "@/components/dashboard/events/event-volunteers-section";
// import { EventStatusCard } from "@/components/dashboard/events/event-status-card";
import { currentUser } from "@/lib/services/user";
import prisma from "@/lib/prisma";
import { OrgRole } from "@/generated/prisma/enums";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string; eventId: string }>
}) {
  const { id: orgId, eventId } = await params;

  const user = await currentUser();

  if (!user) notFound();

  const [event, membership] = await Promise.all([
    prisma.event.findFirst({
      where: {
        id: eventId,
        organizationId: orgId
      },
      include: {
        serviceType: {
          select: {
            name: true
          }
        },
        assignments: true,
        dates: true,
      }
    }),

    prisma.membership.findUnique({
      where: {
        userId_organizationId: {
          userId: user.id,
          organizationId: orgId
        },
      },
      select: {
        role: true
      }
    }),
  ]);

  if (!event || !membership) notFound();

  const canManage = membership.role === OrgRole.ADMIN || membership.role === OrgRole.OWNER;

  const hasAssignment = event.assignments.some((e) => e.userId === user.id);

  const hasAccess = canManage || hasAssignment;

  if (!hasAccess) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* <EventHeader
        event={event}
        orgId={orgId}
        orgName={org.name}
        userId={user.id}
        canManage={canManage}
        serviceType={serviceType}
      />

      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <EventDetailsCard event={event} canManage={canManage} />
            <EventSetlistSection event={event} canManage={canManage} />
          </div>
          <div className="space-y-6">
            <EventVolunteersSection
              event={event}
              userId={user.id}
              userRoles={userRoles}
              canManage={canManage}
            />
            <EventStatusCard event={event} />
          </div>
        </div>
      </div> */}
      event details test
    </div>
  )
}