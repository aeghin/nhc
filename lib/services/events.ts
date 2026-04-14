import "server-only";

import prisma from "@/lib/prisma";
import { InvitationStatus } from "@/generated/prisma/enums";
import { cacheLife, cacheTag } from "next/cache";


export const userEventsTotalCount = async (userId: string, organizationId: string) => {
    "use cache"

    cacheLife("minutes");
    cacheTag(`user-${userId}-events-${organizationId}`);

    const count = await prisma.eventAssignment.count({
        where: {
          userId,
          organizationId,
          status: InvitationStatus.ACCEPTED
        },
      });

      return count;
}

export const getUserEvents = async (organizationId: string, userId: string) => {
    "use cache"

    cacheLife("minutes");
    cacheTag(`user-${userId}-events-${organizationId}`);

  const events = await prisma.event.findMany({
      where: {
        organizationId,
        assignments: {
          some: {
            userId,
            OR: [
              { status: InvitationStatus.ACCEPTED },
              { status: InvitationStatus.PENDING },
            ]
          }
        }
      },
      include: {
        dates: true,
        assignments: {
          where: {
            userId,
            OR: [
              { status: InvitationStatus.ACCEPTED },
              { status: InvitationStatus.PENDING },
            ]
          },
          select: {
            id: true,
            userId: true,
            role: true,
            status: true,
            assignedBy: { 
              select: {
                firstName: true,
              }
            },
            expiresAt: true,
          }
        }
      }
    });

    return events;
};