import { AnimatedSection } from "@/components/dashboard/animate-section";
import { UserRolesCard } from "@/components/dashboard/user-roles-card";

import { userRoles } from "@/lib/services/user";


interface UserRolesSectionProps {
  organizationId: string;
  userId: string;
}

export const UserRolesSection = async ({
  organizationId,
  userId,
}: UserRolesSectionProps) => {

const roles = await userRoles(userId, organizationId);
  
  return (
    <AnimatedSection delay={0.15}>
      <UserRolesCard
        roles={roles?.volunteerRoles ?? []}
        organizationName={roles?.organization.name ?? ""}
      />
    </AnimatedSection>
  );
};
