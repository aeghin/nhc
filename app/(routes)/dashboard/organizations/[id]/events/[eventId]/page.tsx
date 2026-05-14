import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AnimatedSection } from "@/components/dashboard/animate-section";
import { BackLink } from "@/components/dashboard/back-link-button";
import { EventHeader } from "@/components/dashboard/events/event-header";
import { EventDetailsCard } from "@/components/dashboard/events/event-details-card";
import { EventSetlistSection } from "@/components/dashboard/events/event-setlist-section";
import { EventAssignmentsCard } from "@/components/dashboard/events/event-assignment-section";
import { EventDetailContentSkeleton } from "@/components/dashboard/events/event-detail-skeleton";
import { currentUser } from "@/lib/services/user";
import { getEventDetailsById } from "@/lib/services/events";
import { getUserMembershipWithOrg } from "@/lib/services/organization";
import { OrgRole } from "@/generated/prisma/enums";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string; eventId: string }>
}) {
  const { id: orgId, eventId } = await params;

  const user = await currentUser();
  if (!user) notFound();

  const membership = await getUserMembershipWithOrg(user.id, orgId);
  if (!membership) notFound();

  const canManage =
    membership.role === OrgRole.ADMIN || membership.role === OrgRole.OWNER;

  return (
    <main className="mx-auto max-w-screen-2xl px-6 py-8">
      <div className="space-y-8">
        <AnimatedSection delay={0.05}>
          <BackLink
            href={`/dashboard/organizations/${orgId}`}
            label={`Back to ${membership.organization.name}`}
          />
        </AnimatedSection>

        <Suspense fallback={<EventDetailContentSkeleton />}>
          <EventDetailContent
            eventId={eventId}
            orgId={orgId}
            userId={user.id}
            canManage={canManage}
          />
        </Suspense>
      </div>
    </main>
  )
}

async function EventDetailContent({
  eventId,
  orgId,
  userId,
  canManage,
}: {
  eventId: string;
  orgId: string;
  userId: string;
  canManage: boolean;
}) {
  const event = await getEventDetailsById(eventId, orgId);
  if (!event) notFound();

  const hasAccess =
    canManage || event.assignments.some((a) => a.userId === userId);
  if (!hasAccess) notFound();

  return (
    <>
      <AnimatedSection delay={0.1}>
        <EventHeader event={event} serviceType={event.serviceType} />
      </AnimatedSection>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <EventDetailsCard event={event} serviceType={event.serviceType} />
          <EventSetlistSection event={event} orgId={orgId} canManage={canManage} />
        </div>
        <div className="space-y-6">
          <EventAssignmentsCard
            event={event}
            currentUserId={userId}
            canManage={canManage}
          />
        </div>
      </div>
    </>
  )
}
