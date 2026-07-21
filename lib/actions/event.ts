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

import {
  EventEmailInput,
  eventEmailSchema,
} from "@/lib/validations/event-email";

import EventAssignmentEmail from "@/components/email/event-email-template";
import EventMessageEmail from "@/components/email/event-message-template";

import {
  findBestReplacement,
  getConflictingAssignments,
} from "@/lib/services/scheduling";

import { getBlockoutsForDates } from "@/lib/services/blockouts";

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

export type MemberBlockout = {
  startDate: string;
  endDate: string;
};

export type MemberAvailability = {
  conflicts: Record<string, MemberConflict>;
  blockouts: Record<string, MemberBlockout>;
};

type ActionResponse = { success: true } | { success: false; error: string };

export const checkMemberAvailability = async ({
  organizationId,
  dates,
}: CheckMemberAvailabilityInput): Promise<MemberAvailability> => {
  
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

  const [conflictingAssignments, blockoutRows] = await Promise.all([
    getConflictingAssignments(organizationId, dates),
    getBlockoutsForDates(organizationId, dates),
  ]);

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

  const blockouts: Record<string, MemberBlockout> = {};

  for (const blockout of blockoutRows) {
    if (!blockouts[blockout.userId]) {
      blockouts[blockout.userId] = {
        startDate: blockout.startDate.toISOString(),
        endDate: blockout.endDate.toISOString(),
      };
    }
  }

  return { conflicts, blockouts };
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
        include: { organization: { select: { name: true, logoUrl: true } } },
      }),
      prisma.serviceType.findFirst({
        where: { id: serviceTypeId, organizationId, deletedAt: null },
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

    const { name: organizationName, logoUrl } = membership.organization;

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

      // Hard block: members with a blockout on any event day can't be assigned.
      const blockoutRows = await getBlockoutsForDates(
        organizationId,
        Object.values(dayTimes).map((times) => ({
          startTime: times.startTime,
          endTime: times.endTime,
        })),
      );

      const blockedIds = new Set(
        blockoutRows
          .map((b) => b.userId)
          .filter((uid) => assignedUserIds.includes(uid)),
      );

      if (blockedIds.size > 0) {
        const blockedUsers = await prisma.user.findMany({
          where: { id: { in: [...blockedIds] } },
          select: { firstName: true, lastName: true },
        });

        const names = blockedUsers
          .map((u) => `${u.firstName} ${u.lastName}`)
          .join(", ");

        return {
          success: false,
          error: `Unable to assign ${names} — they have blockout dates during this event`,
        };
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
            from: "Aeghin <support@aeghin.com>",
            to: user.email,
            subject: `You've been assigned to ${name}`,
            react: EventAssignmentEmail({
              recipientName: user.firstName,
              eventName: name,
              organizationName: organizationName || "",
              logoUrl,
              viewLink: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/organizations/${organizationId}`,
            }),
          }),
        ),
      );
  });
};

    updateTag(`org-${organizationId}-events`);

    revalidatePath(`/dashboard/organizations/${organizationId}`);

    return { success: true };

  } catch {
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
    updateTag(`org-${organizationId}-acceptance-stats`);

    return { success: true };

  } catch {

    return { success: false, error: "Failed to accept invite" };

  }

}

export const declineEventInvitation = async (organizationId: string, eventId: string): Promise<ActionResponse> => {

  try {

    const user = await currentUser();

    if (!user) return { success: false, error: "Unauthorized" };

    const assignment = await prisma.eventAssignment.findUnique({
      where: {
        eventId_userId: { eventId: eventId, userId: user.id },
        organizationId,
        status: InvitationStatus.PENDING,
      },
      select: {
        id: true,
        role: true,
        assignedById: true,
        expiresAt: true,
        event: { select: { name: true } },
        organization: { select: { smartSchedulingEnabled: true, name: true, logoUrl: true } },
      },
    });

    if (!assignment) return { success: false, error: "Unable to find this event" };

    await prisma.eventAssignment.update({
      where: {
        id: assignment.id,
        organizationId,
      },
      data: {
        status: InvitationStatus.DECLINED
      }
    });

    updateTag(`user-${user.id}-events-${organizationId}`);
    updateTag(`event-${eventId}-org-${organizationId}-details`);
    updateTag(`org-${organizationId}-acceptance-stats`);

    // Smart scheduling: auto-invite the next best available member into the
    // role just vacated. Best-effort and isolated — if anything here fails, the
    // decline the user already committed must still succeed.
    if (assignment.organization.smartSchedulingEnabled) {
      try {
        const replacement = await findBestReplacement({
          organizationId,
          eventId,
          declinedRole: assignment.role,
        });

        if (replacement) {
          await prisma.eventAssignment.create({
            data: {
              eventId,
              userId: replacement.userId,
              role: assignment.role,
              assignedById: assignment.assignedById,
              organizationId,
              status: InvitationStatus.PENDING,
              autoAssigned: true,
              // Keep the slot's original deadline; fall back to a fresh window
              // only if that deadline has already passed.
              expiresAt:
                assignment.expiresAt > new Date()
                  ? assignment.expiresAt
                  : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          });

          updateTag(`user-${replacement.userId}-events-${organizationId}`);
          updateTag(`event-${eventId}-org-${organizationId}-details`);

          after(async () => {
            await resend.emails.send({
              from: "Aeghin <support@aeghin.com>",
              to: replacement.email,
              subject: `You've been assigned to ${assignment.event.name}`,
              react: EventAssignmentEmail({
                recipientName: replacement.firstName,
                eventName: assignment.event.name,
                organizationName: assignment.organization.name,
                logoUrl: assignment.organization.logoUrl,
                viewLink: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/organizations/${organizationId}`,
              }),
            });
          });
        }
      } catch {
        // Swallow: smart-fill is best-effort; the decline already committed.
      }
    }

    return { success: true };

  } catch {

    return { success: false, error: "Unable to decline Invite" };

  };
};

export const cancelUserEventAssignment = async (userId: string, organizationId: string, eventId: string): Promise<ActionResponse> => {
  
  try {

    const user = await currentUser();

    if (!user) return { success: false, error: "Unauthorized" };

    const userMembership = await prisma.membership.findUnique({
      where: {
        userId_organizationId: {
          userId: user.id, 
          organizationId,
        }
      },
      select: {
        role: true
      }
    });

    if (!userMembership) return { success: false, error: "Unable to locate membership" };

    if (userMembership.role === OrgRole.MEMBER) return { success: false, error: "Unauthorized" };

    await prisma.eventAssignment.update({
      where: {
        eventId_userId: {
          eventId,
          userId
        },
        organizationId
      },
      data: {
        status: InvitationStatus.CANCELED
      }
    }); 

    updateTag(`user-${userId}-events-${organizationId}`);
    updateTag(`event-${eventId}-org-${organizationId}-details`);

    return { success: true };

  } catch {
    
    return { success: false, error: "Something went wrong, try again" };

  };
}


export const deleteEvent = async (organizationId: string, eventId: string): Promise<ActionResponse> => {

  try {


    const user = await currentUser();

    if (!user) return { success: false, error: "Unable to find user." };

    if (!organizationId || !eventId) return { success: false, error: "No data provided." };

    const userMembership = await prisma.membership.findUnique({
      where: {
        userId_organizationId: {
          userId: user.id,
          organizationId
        }
      },
      select: {
        role: true
      }
    });

    if (!userMembership) return { success: false, error: "No user membership found with this organization" };

    if (userMembership.role === OrgRole.MEMBER) return { success: false, error: "Insufficient permissions." };

    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        organizationId,
      },
      select: {
        assignments: {
          select: { userId: true, status: true },
        },
      },
    });

    if (!event) return { success: false, error: "Unable to locate event" };

    await prisma.event.delete({
      where: {
        id: eventId
      }
    });

    updateTag(`org-${organizationId}-events`);
    updateTag(`event-${eventId}-org-${organizationId}-details`);

    for (const { userId } of event.assignments) {
      updateTag(`user-${userId}-events-${organizationId}`);
    };

    const affectsAcceptanceStats = event.assignments.some(
      (assignment) =>
        assignment.status === InvitationStatus.ACCEPTED ||
        assignment.status === InvitationStatus.DECLINED,
    );

    if (affectsAcceptanceStats) {
      updateTag(`org-${organizationId}-acceptance-stats`);
    };

    return { success: true };

  } catch {
    return { success: false, error: "Something went wrong. Try again." };
  }
}

type EmailTeamResult =
  | { success: true; sentCount: number }
  | { success: false; error: string };

export const emailAcceptedVolunteers = async (
  organizationId: string,
  eventId: string,
  input: EventEmailInput,
): Promise<EmailTeamResult> => {

  try {

    const user = await currentUser();

    if (!user) return { success: false, error: "Unauthorized" };

    const parsed = eventEmailSchema.safeParse(input);

    if (!parsed.success) return { success: false, error: parsed.error.message };

    const { subject, body } = parsed.data;

    const membership = await prisma.membership.findUnique({
      where: {
        userId_organizationId: { userId: user.id, organizationId },
      },
      include: { organization: { select: { name: true, logoUrl: true } } },
    });

    if (!membership) return { success: false, error: "Unable to find membership" };

    if (membership.role !== OrgRole.OWNER && membership.role !== OrgRole.ADMIN) {
      return {
        success: false,
        error: "Unauthorized, please reach out to your Admin",
      };
    }

    const event = await prisma.event.findFirst({
      where: { id: eventId, organizationId },
      select: {
        name: true,
        assignments: {
          where: {
            status: InvitationStatus.ACCEPTED,
          },
          select: {
            user: { select: { email: true, firstName: true } },
          },
        },
      },
    });

    if (!event) return { success: false, error: "Unable to locate event" };

    const recipients = event.assignments;

    if (recipients.length === 0) {
      return { success: false, error: "No accepted volunteers to email" };
    }

    const { name: organizationName, logoUrl } = membership.organization;
    const senderName = `${user.firstName} ${user.lastName}`;
    const viewLink = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/organizations/${organizationId}/events/${eventId}`;

    const emails = recipients.map(({ user: recipient }) => ({
      from: `${organizationName} <support@aeghin.com>`,
      to: recipient.email,
      replyTo: user.email,
      subject,
      react: EventMessageEmail({
        recipientName: recipient.firstName,
        senderName,
        organizationName,
        logoUrl,
        eventName: event.name,
        body,
        viewLink,
      }),
    }));

    // Sent in the request (not after()) so the sender gets a real
    // delivered/failed answer. batch.send caps at 100 emails per call.
    for (let i = 0; i < emails.length; i += 100) {
      const { error } = await resend.batch.send(emails.slice(i, i + 100));

      if (error) {
        return { success: false, error: "Unable to send message, please try again" };
      }
    }

    return { success: true, sentCount: recipients.length };

  } catch {

    return { success: false, error: "Something went wrong, please try again" };

  };
};