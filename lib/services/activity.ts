import "server-only";

import prisma from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";
import type { ActivityType } from "@/generated/prisma/enums";

export const ACTIVITY_PAGE_SIZE = 10;

export type ActivityItem = {
  id: string;
  type: ActivityType;
  actorName: string | null;
  targetName: string | null;
  detail: string | null;
  createdAt: Date;
};

// `page` is 1-based and must already be clamped to the real range — a page
// below 1 would produce a negative skip.
export const getOrganizationActivity = async (
  organizationId: string,
  page: number
): Promise<ActivityItem[]> => {
  "use cache";

  cacheLife("minutes");
  cacheTag(`org-${organizationId}-activity`);

  return prisma.activityLog.findMany({
    where: { organizationId },
    // id is the unique tiebreak so the sort is total and a row can't drift
    // between pages when several share a createdAt.
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    skip: (page - 1) * ACTIVITY_PAGE_SIZE,
    take: ACTIVITY_PAGE_SIZE,
    select: {
      id: true,
      type: true,
      actorName: true,
      targetName: true,
      detail: true,
      createdAt: true,
    },
  });
};

// Cached apart from the rows so paging through the feed reuses a single count
// instead of re-running it once per page.
export const getOrganizationActivityPageCount = async (
  organizationId: string
): Promise<number> => {
  "use cache";

  cacheLife("minutes");
  cacheTag(`org-${organizationId}-activity`);

  const total = await prisma.activityLog.count({ where: { organizationId } });

  return Math.ceil(total / ACTIVITY_PAGE_SIZE);
};
