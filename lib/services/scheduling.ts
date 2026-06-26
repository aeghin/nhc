import "server-only";

import prisma from "@/lib/prisma";
import { InvitationStatus, VolunteerRole } from "@/generated/prisma/enums";
import { cacheLife, cacheTag } from "next/cache";

type DateRange = { startTime: Date | string; endTime: Date | string };

export async function getConflictingAssignments(
  organizationId: string,
  dates: DateRange[],
) {
  const overlapConditions = dates.map(({ startTime, endTime }) => ({
    event: {
      dates: {
        some: {
          startTime: { lt: new Date(endTime) },
          endTime: { gt: new Date(startTime) },
        },
      },
    },
  }));

  return prisma.eventAssignment.findMany({
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
          dates: { select: { startTime: true, endTime: true } },
        },
      },
    },
  });
}


export async function getConflictingUserIds(
  organizationId: string,
  dates: DateRange[],
): Promise<Set<string>> {
  if (dates.length === 0) return new Set();
  const rows = await getConflictingAssignments(organizationId, dates);
  return new Set(rows.map((r) => r.userId));
}

async function getAcceptanceCounts(organizationId: string) {
  const grouped = await prisma.eventAssignment.groupBy({
    by: ["userId", "status"],
    where: {
      organizationId,
      status: { in: [InvitationStatus.ACCEPTED, InvitationStatus.DECLINED] },
    },
    _count: { _all: true },
  });

  const counts = new Map<string, { accepted: number; declined: number }>();
  for (const row of grouped) {
    const entry = counts.get(row.userId) ?? { accepted: 0, declined: 0 };
    if (row.status === InvitationStatus.ACCEPTED) entry.accepted = row._count._all;
    else entry.declined = row._count._all;
    counts.set(row.userId, entry);
  }
  return counts;
}

export type ReplacementCandidate = {
  userId: string;
  email: string;
  firstName: string;
};


export async function findBestReplacement(params: {
  organizationId: string;
  eventId: string;
  declinedRole: VolunteerRole;
  excludeUserIds?: string[];
}): Promise<ReplacementCandidate | null> {
  const { organizationId, eventId, declinedRole, excludeUserIds = [] } = params;

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { dates: { select: { startTime: true, endTime: true } } },
  });
  if (!event) return null;

  const existing = await prisma.eventAssignment.findMany({
    where: { eventId },
    select: { userId: true },
  });
  const excluded = new Set<string>([
    ...excludeUserIds,
    ...existing.map((e) => e.userId),
  ]);

  const [conflicting, candidates] = await Promise.all([
    getConflictingUserIds(organizationId, event.dates),
    prisma.membership.findMany({
      where: {
        organizationId,
        volunteerRoles: { has: declinedRole },
      },
      select: {
        createdAt: true,
        user: { select: { id: true, email: true, firstName: true } },
      },
    }),
  ]);

  const eligible = candidates.filter(
    (m) => !excluded.has(m.user.id) && !conflicting.has(m.user.id),
  );
  if (eligible.length === 0) return null;

  const counts = await getAcceptanceCounts(organizationId);

  const ranked = eligible
    .map((m) => {
      const { accepted, declined } = counts.get(m.user.id) ?? {
        accepted: 0,
        declined: 0,
      };
      const total = accepted + declined;
      // Laplace smoothing: no-history members sit at 0.5.
      const rate = (accepted + 1) / (total + 2);
      return { member: m, rate, total };
    })
    .sort((a, b) => {
      if (b.rate !== a.rate) return b.rate - a.rate; // higher acceptance first
      if (b.total !== a.total) return b.total - a.total; // more proven first
      return a.member.createdAt.getTime() - b.member.createdAt.getTime();
    });

  const best = ranked[0].member.user;
  return { userId: best.id, email: best.email, firstName: best.firstName };
}

export async function getMemberAcceptanceStats(organizationId: string) {
  "use cache";

  cacheLife("minutes");
  cacheTag(`org-${organizationId}-acceptance-stats`);

  const counts = await getAcceptanceCounts(organizationId);

  const stats: Record<
    string,
    { accepted: number; declined: number; rate: number }
  > = {};
  for (const [userId, { accepted, declined }] of counts) {
    const total = accepted + declined;
    stats[userId] = {
      accepted,
      declined,
      rate: total === 0 ? 0 : accepted / total,
    };
  }
  return stats;
}
