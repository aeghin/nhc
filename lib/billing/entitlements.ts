import "server-only";

/**
 * Placeholder for the AI setlist entitlement.
 *
 * TODO(stripe): replace the body with the real check against the org's
 * Stripe subscription (active plan + remaining generation quota).
 * Keep this signature so call sites never change.
 */
export async function getAiSetlistAccess(_params: {
  userId: string;
  orgId: string;
}): Promise<boolean> {
  // Temporarily open while the feature is built/tested pre-paywall.
  return true;
}
