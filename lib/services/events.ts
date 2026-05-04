import "server-only";

import prisma from "@/lib/prisma";
import { InvitationStatus, type VolunteerRole } from "@/generated/prisma/enums";
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


export const getEventDetailsById = async (eventId: string, organizationId: string) => {
  
  "use cache";

  cacheLife("hours");

  cacheTag(`event-${eventId}-org-${organizationId}-details`);

  const details = await prisma.event.findFirst({
      where: {
        id: eventId,
        organizationId
      },
      include: {
        organization: {
          select: {
            name: true
          }
        },
        dates: true,
        serviceType: true,
        assignments: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                userImageUrl: true,
              }
            }
          }
        }
      }
    });

    return details;

}

export type EventDetailsAssignment = {
  id: string
  eventId: string
  userId: string
  assignedById: string
  organizationId: string
  role: VolunteerRole
  status: InvitationStatus
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
  user: {
    firstName: string
    lastName: string
    userImageUrl: string | null
  }
}

export type EventDetails = {
  id: string
  name: string
  description: string
  location: string
  createdAt: Date
  updatedAt: Date
  createdById: string
  serviceTypeId: string
  organizationId: string
  organization: {
    name: string
  }
  dates: {
    id: string
    eventId: string
    startTime: Date
    endTime: Date
  }[]
  serviceType: {
    id: string
    name: string
    color: string
    organizationId: string
    createdAt: Date
    updatedAt: Date
  }
  assignments: EventDetailsAssignment[]
}