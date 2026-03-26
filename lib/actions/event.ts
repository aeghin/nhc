"use server";

import prisma from "@/lib/prisma";
import { InvitationStatus, OrgRole } from "@/generated/prisma/enums";
import { auth } from "@clerk/nextjs/server";

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

type ActionResponse =
  | { success: true; }
  | { success: false; error: string }

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
  };
  
  const overlapConditions = dates.map(({ date, startTime, endTime }) => {
    const newStart = new Date(`${date}T${startTime}:00`);
    const newEnd = new Date(`${date}T${endTime}:00`);

    return {
      event: {
        startTime: { lt: newEnd },
        endTime: { gt: newStart },
      },
    };
  });

  
  const conflictingAssignments = await prisma.eventAssignment.findMany({
    where: {
      organizationId,
      status: InvitationStatus.ACCEPTED,
      OR: overlapConditions,
    },
    select: {
      userId: true,
      event: {
        select: {
          name: true,
          startTime: true,
          endTime: true,
        },
      },
    },
  });

  
  const conflicts: Record<string, MemberConflict> = {};

  for (const assignment of conflictingAssignments) {
    if (!conflicts[assignment.userId]) {
      conflicts[assignment.userId] = {
        eventName: assignment.event.name,
        startTime: assignment.event.startTime.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
        endTime: assignment.event.endTime.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      };
    }
  }

  return conflicts;
};


export async function createEvent(): Promise<ActionResponse> {

    try {
      
      const { userId } = await auth();

      if (!userId) return { success: false, error: "Unauthrozied" }




      return { success: true }

    } catch (error) {
      return { success: false, error: "Unable to create event" }
    };
};