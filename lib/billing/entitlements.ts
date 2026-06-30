import "server-only";

import prisma from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";


async function getOrgEntitlements(orgId: string): Promise<string[]> {
  "use cache";

  cacheLife("minutes");

  cacheTag(`org-${orgId}-billing`);

  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    select: { entitlements: true },
  });

  return org?.entitlements ?? [];
}

export async function getAiSetlistAccess(params: {
  userId: string;
  orgId: string;
}): Promise<boolean> {
  const entitlements = await getOrgEntitlements(params.orgId);
  return entitlements.includes("ai_setlist");
};

export async function getAiProAccess(params: {
  userId: string;
  orgId: string;
}): Promise<boolean> {
  const entitlements = await getOrgEntitlements(params.orgId);
  return entitlements.includes("ai_pro");
};
