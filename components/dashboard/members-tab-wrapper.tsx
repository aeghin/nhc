import { MembersDashboard } from "@/components/dashboard/members-tab-content";
import { getOrgMembers } from "@/lib/services/organization";

interface MembersTabWrapperProps {
  organizationId: string;
  canManage: boolean;
}

export const MembersTabWrapper = async ({
  organizationId,
  canManage,
}: MembersTabWrapperProps) => {
  const members = await getOrgMembers(organizationId);

  return <MembersDashboard members={members} canManage={canManage} />;
};
