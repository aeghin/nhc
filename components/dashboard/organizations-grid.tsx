import { OrganizationCard } from "./organization-card";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserOrganizations } from "@/lib/services/organization";


export async function OrganizationsGrid() {

  const { userId } = await auth();
  
  if (!userId) redirect("/sign-in");
  
  const organizations = await getUserOrganizations(userId);

  // Fetch event counts per org in parallel
  // const orgEventArrays = await Promise.all(
  //   visibleOrganizations.map(async (org) => {
  //     const events = await getEventsByOrganization(org.id)
  //     return {
  //       orgId: org.id,
  //       upcomingCount: events.filter((e) => e.status === "upcoming").length,
  //     }
  //   })
  // )

  // const orgEventCounts: Record<string, number> = {}
  // orgEventArrays.forEach(({ orgId, upcomingCount }) => {
  //   orgEventCounts[orgId] = upcomingCount
  // })

  // Pending invitation counts per org
  // const invitationCountByOrg = invitations.reduce(
  //   (acc, inv) => {
  //     if (inv.status === "pending") {
  //       acc[inv.organizationId] = (acc[inv.organizationId] || 0) + 1
  //     }
  //     return acc
  //   },
  //   {} as Record<string, number>
  // )

  
  const upcomingEvents = 1;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">
          Your Organizations
        </h2>
        <p className="text-sm text-muted-foreground">
          Select an organization to view details and events
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {organizations.map((org) => (
          <OrganizationCard
            key={org.id}
            organization={org}
            upcomingEvents={upcomingEvents}
          />
        ))}
      </div>
    </div>
  )
}
