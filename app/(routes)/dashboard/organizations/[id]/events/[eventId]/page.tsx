
import { notFound } from "next/navigation";
// import {
//   getEventById,
//   getOrganizationById,
//   getCurrentUser,
//   getServiceTypesByOrganization,
// } from "@/lib/services/data"
import { AnimatedSection } from "@/components/dashboard/animate-section";
import { BackLink } from "@/components/dashboard/back-link-button";
import { EventHeader } from "@/components/dashboard/events/event-header";
import { EventDetailsCard } from "@/components/dashboard/events/event-details-card";
import { EventSetlistSection } from "@/components/dashboard/events/event-setlist-section";
import { EventAssignmentsCard } from "@/components/dashboard/events/event-assignment-section";
// import { EventStatusCard } from "@/components/dashboard/events/event-status-card";
import { currentUser } from "@/lib/services/user";
import { getEventDetailsById } from "@/lib/services/events";
import { getUserMembershipRole } from "@/lib/services/organization";
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
    getEventDetailsById(eventId, orgId),
    getUserMembershipRole(user.id, orgId),
  ]);

  if (!event || !membership) notFound();

  const canManage = membership.role === OrgRole.ADMIN || membership.role === OrgRole.OWNER;

  const hasAssignment = event.assignments.some((e) => e.userId === user.id);

  const hasAccess = canManage || hasAssignment;

  if (!hasAccess) notFound();

  return (
    <main className="mx-auto max-w-screen-2xl px-6 py-8">
      <div className="space-y-8">
        <AnimatedSection delay={0.05}>
          <BackLink
            href={`/dashboard/organizations/${orgId}`}
            label={`Back to ${event.organization.name}`}
          />
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <EventHeader
            event={event}
            serviceType={event.serviceType}
          />
        </AnimatedSection>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <EventDetailsCard event={event} serviceType={event.serviceType} />
            <EventSetlistSection event={event} orgId={orgId} canManage={canManage} />
          </div>
          <div className="space-y-6">
            <EventAssignmentsCard
              event={event}
              currentUserId={user.id}
              canManage={canManage}
            />
            {/* <EventStatusCard event={event} /> */}
          </div>
        </div>
      </div>
    </main>
  )
}