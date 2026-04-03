import 'server-only';

import prisma from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

export const getUserInfo = async (userId: string) => {
    "use cache";
    
    cacheLife('hours');

    cacheTag(`user-${userId}`);

    const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { firstName: true }
  });

  return user?.firstName ?? "User";
};


export const userRoles = async (userId: string, organizationId: string) => {
  "use cache: remote";

  cacheLife('hours');
  
  cacheTag(`user-${userId}-roles`);
  
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

  return roles;
};