"use server";

import prisma from "@/lib/prisma";
import {
  InvitationStatus,
  OrgRole,
  VolunteerRole,
} from "@/generated/prisma/enums";

import {
  CreateEventInput,
  createEventInputSchema,
} from "@/lib/validations/event";

import EventAssignmentEmail from "@/components/email/event-email-template";

import { Resend } from "resend";
import { revalidatePath, updateTag } from "next/cache";

import { currentUser } from "@/lib/services/user";

import { after } from "next/server";

const resend = new Resend(process.env.RESEND_EMAIL_API_KEY);

type CheckMemberAvailabilityInput = {
  organizationId: string;
  dates: {
    date: string;
    startTime: string;
    endTime: string;
  }[];
};

export type MemberConflict = {
  eventName: string;
  startTime: string;
  endTime: string;
};

type ActionResponse = { success: true } | { success: false; error: string };

export const checkMemberAvailability = async ({
  organizationId,
  dates,
}: CheckMemberAvailabilityInput): Promise<Record<string, MemberConflict>> => {
  
  const user = await currentUser();

  if (!user) throw new Error("Unauthorized");

  const { id } = user;

  const membership = await prisma.membership.findFirst({
    where: {
      userId: id,
      organizationId,
    },
    select: { role: true },
  });

  if (!membership || membership.role === OrgRole.MEMBER) {
    throw new Error("Unauthorized");
  }

  const overlapConditions = dates.map(({ startTime, endTime }) => {
    const newStart = new Date(startTime);
    const newEnd = new Date(endTime);

    return {
      event: {
        dates: {
          some: {
            startTime: { lt: newEnd },
            endTime: { gt: newStart },
          },
        },
      },
    };
  });

  const conflictingAssignments = await prisma.eventAssignment.findMany({
    where: {
      organizationId,
      AND: [
        {
          OR: [
            { status: InvitationStatus.ACCEPTED },
            {
              status: InvitationStatus.PENDING,
              expiresAt: { gt: new Date() },
            },
          ],
        },
        { OR: overlapConditions },
      ],
    },
    select: {
      userId: true,
      event: {
        select: {
          name: true,
          dates: {
            select: {
              startTime: true,
              endTime: true,
            },
          },
        },
      },
    },
  });

  const conflicts: Record<string, MemberConflict> = {};

  for (const assignment of conflictingAssignments) {
    if (!conflicts[assignment.userId]) {
      const overlappingDate = assignment.event.dates.find((eventDate) => {
        return dates.some(({ startTime, endTime }) => {
          const newStart = new Date(startTime);
          const newEnd = new Date(endTime);
          return eventDate.startTime < newEnd && eventDate.endTime > newStart;
        });
      });

      const displayDate = overlappingDate || assignment.event.dates[0];

      conflicts[assignment.userId] = {
        eventName: assignment.event.name,
        startTime: displayDate.startTime.toISOString(),
        endTime: displayDate.endTime.toISOString(),
      };
    }
  }

  return conflicts;
};

export async function createEvent(
  input: CreateEventInput,
  organizationId: string,
): Promise<ActionResponse> {
  try {
    
    const users = await currentUser();

    if (!users) return { success: false, error: "Unauthorized" };

    const { id } = users;

    const parsed = createEventInputSchema.safeParse(input);

    if (!parsed.success) return { success: false, error: parsed.error.message };

    const {
      serviceTypeId,
      name,
      dayTimes,
      location,
      description,
      roleAssignments,
      expiresAt
    } = parsed.data;

    const [membership, serviceType] = await Promise.all([
      prisma.membership.findFirst({
        where: { userId: id, organizationId },
        include: { organization: { select: { name: true } } },
      }),
      prisma.serviceType.findFirst({
        where: { id: serviceTypeId, organizationId },
      }),
    ]);

    if (!membership) return { success: false, error: "Unable to find user" };

    if (membership.role !== OrgRole.OWNER && membership.role !== OrgRole.ADMIN) {
      return {
        success: false,
        error: "Unauthorized, please reach out to your Admin",
      };
    }

    if (!serviceType) return { success: false, error: "Invalid Service Type" };

    const organizationName = membership.organization.name;

    const assignedUserIds = Object.values(roleAssignments).flat();

    if (assignedUserIds.length > 0) {
      const validMemberships = await prisma.membership.count({
        where: {
          organizationId,
          userId: { in: assignedUserIds },
        },
      });

      if (validMemberships !== new Set(assignedUserIds).size) {
        return { success: false, error: "One or more assigned users are not members of this organization" };
      }
    }

     await prisma.$transaction(async (tx) => {
      const event = await tx.event.create({
        data: {
          name,
          description: description || "",
          location,
          createdById: id,
          serviceTypeId,
          organizationId,
        },
      });

      await tx.eventDate.createMany({
        data: Object.entries(dayTimes).map(([, times]) => ({
          eventId: event.id,
          startTime: new Date(times.startTime),
          endTime: new Date(times.endTime),
        })),
      });

      if (assignedUserIds.length > 0) {
        await tx.eventAssignment.createMany({
          data: Object.entries(roleAssignments).flatMap(([role, userIds]) =>
            userIds.map((uid) => ({
              eventId: event.id,
              userId: uid,
              role: role as VolunteerRole,
              assignedById: id,
              organizationId,
              expiresAt: new Date(Date.now() + expiresAt * 24 * 60 * 60 * 1000)
            })),
          ),
        });
      }
    });

    if (assignedUserIds.length > 0) {
      const assignedUsers = await prisma.user.findMany({
        where: { id: { in: assignedUserIds } },
        select: { id: true, email: true, firstName: true },
      });

      for (const uid of new Set(assignedUserIds)) {
        updateTag(`user-${uid}-events-${organizationId}`)
      };

      after(async () => {await Promise.allSettled(
        assignedUsers.map((user) =>
          resend.emails.send({
            from: "NHC <noreply@aeghin.com>",
            to: user.email,
            subject: `You've been assigned to ${name}`,
            react: EventAssignmentEmail({
              recipientName: user.firstName,
              eventName: name,
              organizationName: organizationName || "",
              viewLink: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/organizations/${organizationId}`,
            }),
          }),
        ),
      );
  });
};

    revalidatePath(`/dashboard/organizations/${organizationId}`);

    return { success: true };
    
  } catch (error) {
    return { success: false, error: "Unable to create event" };
  }
}


export const acceptEventInvitation = async (organizationId: string, eventId: string): Promise<ActionResponse> => {

  try {

    const user = await currentUser();

    if (!user) return { success: false, error: "Unauthorized" };

    const event = await prisma.eventAssignment.findUnique({
      where: {
        eventId_userId: { eventId: eventId, userId: user.id },
        organizationId,
        status: InvitationStatus.PENDING,
        expiresAt: { gt: new Date() }
      }
    });

    if (!event) return { success: false, error: "Unable to find this event" };

    await prisma.eventAssignment.update({
      where: {
        id: event.id,
        organizationId,
      },
      data: {
        status: InvitationStatus.ACCEPTED
      }
    });

    updateTag(`user-${user.id}-events-${organizationId}`);
    updateTag(`event-${eventId}-org-${organizationId}-details`);

    return { success: true };

  } catch (error) {

    return { success: false, error: "Failed to accept invite" };

  }

}

export const declineEventInvitation = async (organizationId: string, eventId: string): Promise<ActionResponse> => {

  try {

    const user = await currentUser();

    if (!user) return { success: false, error: "Unauthorized" };

    const event = await prisma.eventAssignment.findUnique({
      where: {
        eventId_userId: { eventId: eventId, userId: user.id },
        organizationId,
        status: InvitationStatus.PENDING,
      }
    });

    if (!event) return { success: false, error: "Unable to find this event" };

    await prisma.eventAssignment.update({
      where: {
        id: event.id,
        organizationId,
      },
      data: {
        status: InvitationStatus.DECLINED
      }
    });

    updateTag(`user-${user.id}-events-${organizationId}`);
    updateTag(`event-${eventId}-org-${organizationId}-details`);

    return { success: true };

  } catch (error) {

    return { success: false, error: "Unable to decline Invite" };

  };
};

