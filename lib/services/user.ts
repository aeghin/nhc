'server-only';

import prisma from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

export const getUserInfo = async (userId: string) => {
    'use cache';
    
    cacheLife('hours');

    cacheTag(`user-${userId}`);

    const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { firstName: true }
  });

  return user?.firstName ?? "User";
};