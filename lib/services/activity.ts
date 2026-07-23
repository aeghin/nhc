import "server-only";

import prisma from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

export const getOrganizationActivity = async (organizationId: string) => {
  "use cache";

  cacheLife("minutes");
  cacheTag(`org-${organizationId}-activity`);

  const activities = await prisma.activityLog.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return activities;
};
