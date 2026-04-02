import "server-only";

import prisma from "@/lib/prisma";
import { InvitationStatus } from "@/generated/prisma/enums";
import { cacheLife } from "next/cache";


export const userEventsTotalCount = async (userId: string, organizationId: string) => {
    "use cache"

    cacheLife("minutes");

    const count = await prisma.eventAssignment.count({
        where: {
          user: {
            clerkId: userId
          },
          organizationId,
          status: {
            in: [InvitationStatus.ACCEPTED, InvitationStatus.PENDING]
          }
        },
      });

      return count;
}