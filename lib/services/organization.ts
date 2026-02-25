import 'server-only'

import prisma from "../prisma";
import { auth } from "@clerk/nextjs/server";

export const getOrganizationById = async (id: string) => {
    
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  const organization = await prisma.organization.findUnique({
    where: {
      id,
    },
    include: {
      memberships: {
        where: {
          user: {
            clerkId: userId,
          },
        },
        select: {
          role: true,
        },
      },
    },
  });

  if (!organization || organization.memberships.length === 0) {
    return null;
  };

  return organization;
};


export const getUserOrganizations = async (userId: string) => {
  
  const user = await prisma.user.findUnique({
  where: { clerkId: userId },
  include: {
    memberships: {
      include: {
        organization: {
          include: {
            _count: {
              select: { memberships: true, invitations: true },
            },
          },
        },
      },
    },
  },
});
  
    
    const organizations = user?.memberships.map((m) => ({
      id: m.organization.id,
      name: m.organization.name,
      description: m.organization.description,
      role: m.role,
      memberCount: m.organization._count.memberships,
      invitationCount: m.organization._count.invitations,
    }));

    return organizations;
};