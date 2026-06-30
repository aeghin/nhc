"use server";

import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/services/user";
import { getUserMembershipRole } from "@/lib/services/organization";
import { getAiSetlistAccess, getAiProAccess } from "@/lib/billing/entitlements";
import { OrgRole } from "@/generated/prisma/enums";

type ActionResult =
  | { success: true; url: string }
  | { success: false; error: string };

async function isOrgOwner(orgId: string): Promise<boolean> {
  const user = await currentUser();
  if (!user) return false;
  const membership = await getUserMembershipRole(user.id, orgId);
  return (
    membership?.role === OrgRole.OWNER
  );
}

/** Reuse the org's Stripe Customer, or create + persist one on first use. */
async function getOrCreateCustomer(orgId: string): Promise<string> {
  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    select: { stripeCustomerId: true, name: true },
  });
  if (!org) throw new Error("Organization not found");
  if (org.stripeCustomerId) return org.stripeCustomerId;

  const customer = await stripe.customers.create({
    name: org.name,
    metadata: { orgId },
  });
  await prisma.organization.update({
    where: { id: orgId },
    data: { stripeCustomerId: customer.id },
  });
  return customer.id;
}

/** Start a subscription Checkout Session for the AI setlist plan. */
export async function startAiSetlistCheckout(
  orgId: string,
): Promise<ActionResult> {
  if (!(await isOrgOwner(orgId))) {
    return { success: false, error: "Forbidden" };
  }

  const customerId = await getOrCreateCustomer(orgId);

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [
      { price: process.env.STRIPE_AI_SETLIST_PRICE_ID!, quantity: 1 },
    ],
    client_reference_id: orgId,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/organizations/${orgId}?upgraded=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/organizations/${orgId}`,
  });

  return session.url
    ? { success: true, url: session.url }
    : { success: false, error: "Could not start checkout" };
}

/** Start a subscription Checkout Session for the AI setlist PRO plan. */
export async function startAiSetlistProCheckout(
  orgId: string,
): Promise<ActionResult> {
  if (!(await isOrgOwner(orgId))) {
    return { success: false, error: "Forbidden" };
  }

  const customerId = await getOrCreateCustomer(orgId);

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [
      { price: process.env.STRIPE_AI_PRO_PRICE_ID!, quantity: 1 },
    ],
    client_reference_id: orgId,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/organizations/${orgId}?upgraded=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/organizations/${orgId}`,
  });

  return session.url
    ? { success: true, url: session.url }
    : { success: false, error: "Could not start checkout" };
}

/** Open the Stripe Customer Portal for self-service subscription management. */
export async function openBillingPortal(orgId: string): Promise<ActionResult> {
  if (!(await isOrgOwner(orgId))) {
    return { success: false, error: "Forbidden" };
  }

  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    select: { stripeCustomerId: true },
  });
  if (!org?.stripeCustomerId) {
    return { success: false, error: "No billing account yet" };
  }

  const portal = await stripe.billingPortal.sessions.create({
    customer: org.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/organizations/${orgId}`,
  });

  return { success: true, url: portal.url };
}

/** Read-only org premium status for the navbar (badge + subscribe button). */
export async function getOrgPremiumStatus(
  orgId: string,
): Promise<{ hasPremium: boolean; hasPro: boolean; canSubscribe: boolean }> {
  const user = await currentUser();
  if (!user) return { hasPremium: false, hasPro: false, canSubscribe: false };

  const [hasPremium, hasPro, membership] = await Promise.all([
    getAiSetlistAccess({ userId: user.id, orgId }),
    getAiProAccess({ userId: user.id, orgId }),
    getUserMembershipRole(user.id, orgId),
  ]);
  const canSubscribe = membership?.role === OrgRole.OWNER;
  return { hasPremium, hasPro, canSubscribe };
}
