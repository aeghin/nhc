"use server";

import { currentUser } from "@/lib/services/user";
import prisma from "@/lib/prisma";
import { OrgRole } from "@/generated/prisma/enums";
import { getOrganizationActivity, type ActivityItem } from "@/lib/services/activity";

type FetchMoreResponse =
  | { success: true; items: ActivityItem[]; nextCursor: string | null }
  | { success: false; error: string };

// Server actions are public endpoints, so this re-checks that the caller can
// manage the org (owner/admin) before returning feed rows — mirrors roles.ts.
export const fetchMoreActivity = async (
  organizationId: string,
  cursor: string
): Promise<FetchMoreResponse> => {
  const user = await currentUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const membership = await prisma.membership.findUnique({
    where: {
      userId_organizationId: { userId: user.id, organizationId },
    },
    select: { role: true },
  });

  if (!membership || membership.role === OrgRole.MEMBER) {
    return { success: false, error: "Unauthorized" };
  }

  const { items, nextCursor } = await getOrganizationActivity(organizationId, cursor);
  return { success: true, items, nextCursor };
};
