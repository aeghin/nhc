import { redirect } from "next/navigation";
import { CreateEventPageContent } from "@/components/dashboard/create-event-content";
import { OrgRole } from "@/generated/prisma/enums";
import { currentUser } from "@/lib/services/user";
import {
  getUserMembershipWithOrg,
  getOrgMembersWithUser,
} from "@/lib/services/organization";
import { getOrgServiceTypes } from "@/lib/services/service-types";


export default async function CreateEventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [{ id: orgId }, user] = await Promise.all([
    params,
    currentUser(),
  ]);

  if (!user) redirect("/sign-in");

  const [membership, members, serviceTypes] = await Promise.all([
    getUserMembershipWithOrg(user.id, orgId),
    getOrgMembersWithUser(orgId),
    getOrgServiceTypes(orgId),
  ])

  const organizationName = membership?.organization.name || '';

  const canManage = membership?.role === OrgRole.OWNER || membership?.role === OrgRole.ADMIN;

  if (!canManage) {
    redirect(`/dashboard/organizations/${orgId}`)
  }

  return (
    <CreateEventPageContent
      organizationId={orgId}
      organizationName={organizationName}
      members={members}
      serviceTypes={serviceTypes}
    />
  )
}
