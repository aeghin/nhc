import 'server-only';

import prisma from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export const userRoles = async (userId: string, organizationId: string) => {
  "use cache";

  cacheLife('hours');
  
  cacheTag(`user-${userId}-roles`);
  
  const roles = await prisma.membership.findFirst({
    where: {
      userId,
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

export const currentUser = async () => {

  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId
    }
  });

  return user;
  
};