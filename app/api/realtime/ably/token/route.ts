import { NextRequest, NextResponse } from "next/server";
import * as Ably from "ably";
import { getAcceptedChatMembership } from "@/lib/services/chat";
import { channelName } from "@/lib/realtime/channels";

// proxy.ts does NOT match /api — so this route authorizes itself.
// Keep on the default Node runtime (Ably Rest + Prisma/pg need Node).
export async function GET(req: NextRequest) {
  const eventId = req.nextUrl.searchParams.get("eventId");
  if (!eventId) {
    return NextResponse.json({ error: "Missing eventId" }, { status: 400 });
  }

  const ctx = await getAcceptedChatMembership(eventId);
  if (!ctx) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const rest = new Ably.Rest({ key: process.env.ABLY_API_KEY! });

  // Capability-scoped: subscribe + presence on THIS event's channel only.
  const tokenRequest = await rest.auth.createTokenRequest({
    clientId: ctx.user.id,
    capability: JSON.stringify({
      [channelName(eventId)]: ["subscribe", "presence"],
    }),
  });

  return NextResponse.json(tokenRequest);
}
