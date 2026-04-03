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

export const getUserEvents = async (organizationId: string, userId: string) => {
    "use cache"

    cacheLife("minutes");

  const events = await prisma.event.findMany({
      where: {
        organizationId,
        assignments: {
          some: {
            user: {
              clerkId: userId
            }
          }
        }
      },
      include: {
        dates: true,
        assignments: {
          where: {
            user: {
              clerkId: userId
            }
          },
          select: {
            id: true,
            userId: true,
            role: true,
            status: true
          }
        }
      }
    });

    return events;
};