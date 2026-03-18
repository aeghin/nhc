import { AnimatedSection } from "@/components/dashboard/animate-section";
import { UserRolesCard } from "@/components/dashboard/user-roles-card";

import prisma from "@/lib/prisma";
import { userAgent } from "next/server";

interface UserRolesSectionProps {
  organizationId: string;
  userId: string;
}

export const UserRolesSection = async ({
  organizationId,
  userId,
}: UserRolesSectionProps) => {

  const roles = await prisma.membership.findFirst({
    where: {
      user: {
        clerkId: userId,
      },
      organizationId,
    },
    select: {
      volunteerRoles: true,
      organization: {
        select: {
          name: true,
        },
      },
    },
  });

  return (
    <AnimatedSection delay={0.15}>
      <UserRolesCard
        roles={roles?.volunteerRoles ?? []}
        organizationName={roles?.organization.name ?? ""}
      />
    </AnimatedSection>
  );
};
