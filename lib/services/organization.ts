import "server-only";

import prisma from "../prisma";
import { cacheLife, cacheTag } from 'next/cache';

export const getOrganizationDetailsById = async (id: string, userId: string) => {
    "use cache";

    cacheLife('minutes');

    cacheTag(`org-${id}-details`);
    cacheTag(`user-${userId}-org-${id}-role`);

  const organization = await prisma.organization.findUnique({
    where: {
      id,
    },
    include: {
      memberships: {
        where: {
          userId
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

  "use cache";

  cacheLife('hours');

  cacheTag(`user-${userId}-orgs`)

  
  const user = await prisma.user.findUnique({
  where: { id: userId },
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

if (!user) return [];
  
    
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

export const getOrgMemberCountById = async (organizationId: string) => {

  "use cache";

  cacheLife('hours');

  cacheTag(`org-${organizationId}-member-count`);

  const count = await prisma.membership.count({
    where: {
      organizationId
    }
  });

  return count;
};

export const getUserVolunteerRolesByOrg = async (organizationId: string, userId: string) => {
    "use cache";

    cacheLife('hours');
    
    cacheTag(`user-${userId}-roles`);

    const count = await prisma.membership.findFirst({
      where: {
        userId,
        organizationId
      },
      select: {
        volunteerRoles: true
      }
    });

    return count?.volunteerRoles.length ?? 0;
};

export const organizationMembersList = async (organizationId: string) => {

  "use cache"

  cacheLife("hours");

  cacheTag(`org-${organizationId}-members-list`);


  const members = await prisma.membership.findMany({
    where: {
      organizationId,
    },
    select: {
      organizationId: true,
      volunteerRoles: true,
      role: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phoneNumber: true,
          userImageUrl: true,
          createdAt: true
        }
      },
    }
  });

  return members;

};
