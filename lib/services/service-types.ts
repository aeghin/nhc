import "server-only";

import prisma from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

export const getOrgServiceTypes = async (organizationId: string) => {
    "use cache"

    cacheLife("minutes");

    cacheTag(`org-${organizationId}-st`);

const serviceTypes = await prisma.serviceType.findMany({
    where: {
      organizationId
    },
    select: {
      id: true,
      name: true,
      color: true
    }
  });

  return serviceTypes;
};




    