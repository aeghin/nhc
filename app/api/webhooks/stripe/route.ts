import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text(); // RAW body required for signature verification
  const signature = req.headers.get("stripe-signature");
  if (!signature) return new Response("Missing signature", { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  // A single event covers grant, upgrade/downgrade, cancel, and lapse.
  if (event.type === "entitlements.active_entitlement_summary.updated") {
    const summary = event.data.object as { customer: string };

    const active = await stripe.entitlements.activeEntitlements.list({
      customer: summary.customer,
    });
    const lookupKeys = active.data.map((e) => e.lookup_key);

    const org = await prisma.organization.findUnique({
      where: { stripeCustomerId: summary.customer },
      select: { id: true },
    });

    if (org) {
      await prisma.organization.update({
        where: { id: org.id },
        data: { entitlements: lookupKeys },
      });
      revalidateTag(`org-${org.id}-billing`, "hours"); // bust the cached entitlement read
    }
  }

  return new Response("ok", { status: 200 });
}
