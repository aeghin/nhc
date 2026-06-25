import "server-only";

import prisma from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

/**
 * Cached per-org read of the entitlement feature lookup_keys mirrored from
 * Stripe by the webhook (app/api/webhooks/stripe/route.ts). Reads our DB —
 * never calls the Stripe API on the hot path. Busted via updateTag on change.
 */
async function getOrgEntitlements(orgId: string): Promise<string[]> {
  "use cache";

  cacheLife("hours");

  cacheTag(`org-${orgId}-billing`);

  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    select: { entitlements: true },
  });

  return org?.entitlements ?? [];
}

/**
 * Premium gate for AI setlist generation.
 *
 * Signature is intentionally stable so call sites never change. `userId` is
 * accepted for future per-user checks; access is currently org-scoped.
 */
export async function getAiSetlistAccess(params: {
  userId: string;
  orgId: string;
}): Promise<boolean> {
  const entitlements = await getOrgEntitlements(params.orgId);
  return entitlements.includes("ai_setlist");
}
