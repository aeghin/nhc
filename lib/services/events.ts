import "server-only";

import prisma from "@/lib/prisma";
import { InvitationStatus } from "@/generated/prisma/enums";
import { cacheLife, cacheTag } from "next/cache";


export const userEventsTotalCount = async (userId: string, organizationId: string, canManage: boolean) => {
    "use cache"

    cacheLife("minutes");

    if (canManage) {
      cacheTag(`org-${organizationId}-events`);

      return prisma.event.count({
        where: {
          organizationId,
          dates: {
            some: {
              endTime: {
                gte: new Date(),
              }
            }
          }
        },
      });
    }

    cacheTag(`user-${userId}-events-${organizationId}`);

    const count = await prisma.eventAssignment.count({
        where: {
          userId,
          organizationId,
          status: InvitationStatus.ACCEPTED,
          event: {
            dates: {
              some: {
                endTime: {
                  gte: new Date(),
                }
              }
            }
          }
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


// All events in the org, for owners/admins who oversee every event regardless
// of assignment. Includes the caller's own assignment (if any) so their role
// badge still shows. Tagged org-wide so the list refreshes when events change.
export const getOrgEvents = async (organizationId: string, userId: string) => {
    "use cache"

    cacheLife("minutes");
    cacheTag(`org-${organizationId}-events`);

  const events = await prisma.event.findMany({
      where: {
        organizationId,
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
  cacheTag(`org-${organizationId}-songs`);

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
        dates: { orderBy: { startTime: "asc" } },
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
        },
        setlistSongs: {
          orderBy: { position: "asc" },
          include: {
            song: {
              select: {
                id: true,
                title: true,
                artist: true,
                youtubeUrl: true,
                spotifyUrl: true,
                attachments: {
                  orderBy: { createdAt: "asc" }
                }
              }
            },
            setlistSongAssignment: {
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
        }
      }
    });

    return details;

}

