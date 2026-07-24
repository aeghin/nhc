import "server-only";

import prisma from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";
import type { ActivityType } from "@/generated/prisma/enums";

const PAGE_SIZE = 20;

export type ActivityItem = {
  id: string;
  type: ActivityType;
  actorName: string | null;
  targetName: string | null;
  detail: string | null;
  createdAt: Date;
};

export type ActivityPage = {
  items: ActivityItem[];
  nextCursor: string | null;
};

export const getOrganizationActivity = async (
  organizationId: string,
  cursor?: string
): Promise<ActivityPage> => {
  "use cache";

  cacheLife("minutes");
  cacheTag(`org-${organizationId}-activity`);

  const rows = await prisma.activityLog.findMany({
    where: { organizationId },
    // id is the unique tiebreak so the sort is total and the cursor is stable
    // even when multiple rows share a createdAt.
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: PAGE_SIZE + 1, // one extra row tells us whether another page exists
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    select: {
      id: true,
      type: true,
      actorName: true,
      targetName: true,
      detail: true,
      createdAt: true,
    },
  });

  const hasMore = rows.length > PAGE_SIZE;
  const items = hasMore ? rows.slice(0, PAGE_SIZE) : rows;
  const last = items.at(-1);

  return { items, nextCursor: hasMore && last ? last.id : null };
};
