import 'server-only'

import prisma from "../prisma";

export const getOrganizationDetailsById = async (id: string, userId: string) => {
    

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

export const orgCountByUserId = async (userId: string) => {
    
  const orgCount = await prisma.membership.count({
  where: {
    user: { clerkId: userId }
  }
  });

  return orgCount;
  
};

export const getOrgMemberCountById = async (organizationId: string) => {
  const count = await prisma.membership.count({
    where: {
      organizationId
    }
  });

  return count;
};

export const getUserVolunteerRolesByOrg = async (organizationId: string, userId: string) => {
    const count = await prisma.membership.findFirst({
      where: {
        user: {
          clerkId: userId
        },
        organizationId
      },
      select: {
        volunteerRoles: true
      }
    });

    return count?.volunteerRoles.length ?? 0;
};