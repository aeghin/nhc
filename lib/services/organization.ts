import "server-only";

import prisma from "../prisma";
import { cacheLife, cacheTag } from 'next/cache';

export const getOrganizationDetailsById = async (id: string, userId: string) => {
    "use cache";

    cacheLife('minutes');

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

  cacheTag('org-members-count');

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

export const getOrgMembers = async (organizationId: string) => {
  "use cache";

  cacheLife('hours');
  
  cacheTag(`org-${organizationId}-members`);

  const members = await prisma.membership.findMany({
    where: {
      organizationId
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          userImageUrl: true
        }
      }
    },
    orderBy: [
      { role: 'asc' },
      { createdAt: 'asc' }
    ]
  });

  return members.map(m => ({
    id: m.id,
    role: m.role,
    volunteerRoles: m.volunteerRoles,
    joinedAt: m.createdAt,
    user: {
      id: m.user.id,
      firstName: m.user.firstName,
      lastName: m.user.lastName,
      email: m.user.email,
      imageUrl: m.user.userImageUrl
    }
  }));
};
