"use server";

import prisma from "@/lib/prisma";
import {
  InvitationStatus,
  OrgRole,
  VolunteerRole,
} from "@/generated/prisma/enums";
import { auth } from "@clerk/nextjs/server";
import {
  CreateEventInput,
  createEventInputSchema,
} from "@/lib/validations/event";

import EventAssignmentEmail from "@/components/email/event-email-template";

import { Resend } from "resend";
import { revalidatePath } from "next/cache";

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
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  const membership = await prisma.membership.findFirst({
    where: {
      user: { clerkId: userId },
      organizationId,
    },
    select: { role: true },
  });

  if (!membership || membership.role === OrgRole.MEMBER) {
    throw new Error("Unauthorized");
  }

  const overlapConditions = dates.map(({ date, startTime, endTime }) => {
    const newStart = new Date(`${date}T${startTime}:00`);
    const newEnd = new Date(`${date}T${endTime}:00`);

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
      status: { in: [InvitationStatus.ACCEPTED, InvitationStatus.PENDING] },
      OR: overlapConditions,
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
        return dates.some(({ date, startTime, endTime }) => {
          const newStart = new Date(`${date}T${startTime}:00`);
          const newEnd = new Date(`${date}T${endTime}:00`);
          return eventDate.startTime < newEnd && eventDate.endTime > newStart;
        });
      });

      const displayDate = overlappingDate || assignment.event.dates[0];

      conflicts[assignment.userId] = {
        eventName: assignment.event.name,
        startTime: displayDate.startTime.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
        endTime: displayDate.endTime.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
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
    const { userId } = await auth();

    if (!userId) return { success: false, error: "Unauthorized" };

    const parsed = createEventInputSchema.safeParse(input);

    if (!parsed.success) return { success: false, error: parsed.error.message };

    const {
      serviceTypeId,
      name,
      dateRange,
      dayTimes,
      location,
      description,
      rolesNeeded,
      roleAssignments,
    } = parsed.data;

    const user = await prisma.membership.findFirst({
      where: {
        user: {
          clerkId: userId,
        },
        organizationId,
      },
      include: {
        organization: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!user) return { success: false, error: "Unable to find user" };

    if (user.role !== OrgRole.OWNER && user.role !== OrgRole.ADMIN) {
      return {
        success: false,
        error: "Unauthorized, please reach out to your Admin",
      };
    }

    const organizationName = user.organization.name;

    const serviceType = await prisma.serviceType.findFirst({
      where: {
        id: serviceTypeId,
        organizationId,
      },
    });

    if (!serviceType) return { success: false, error: "Invalid Service Type" };

    const assignedUserIds = Object.values(roleAssignments).flat();

    const event = await prisma.$transaction(async (tx) => {
      const event = await tx.event.create({
        data: {
          name,
          description: description || "",
          location,
          createdById: user.userId,
          serviceTypeId,
          organizationId,
        },
      });

      await tx.eventDate.createMany({
        data: Object.entries(dayTimes).map(([date, times]) => ({
          eventId: event.id,
          startTime: new Date(`${date}T${times.startTime}:00`),
          endTime: new Date(`${date}T${times.endTime}:00`),
        })),
      });

      if (assignedUserIds.length > 0) {
        await tx.eventAssignment.createMany({
          data: Object.entries(roleAssignments).flatMap(([role, userIds]) =>
            userIds.map((uid) => ({
              eventId: event.id,
              userId: uid,
              role: role as VolunteerRole,
              assignedById: user.userId,
              organizationId,
            })),
          ),
        });
      }

      return event;
    });

    if (assignedUserIds.length > 0) {
      const assignedUsers = await prisma.user.findMany({
        where: { id: { in: assignedUserIds } },
        select: { id: true, email: true, firstName: true },
      });

      await Promise.allSettled(
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
    };

    revalidatePath(`/dashboard/organizations/${organizationId}`);

    return { success: true };
    
  } catch (error) {
    return { success: false, error: "Unable to create event" };
  }
}
