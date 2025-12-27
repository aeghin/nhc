import prisma from "@/lib/prisma";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const event = await verifyWebhook(req, {
        signingSecret: process.env.CLERK_WEBHOOK_SIGNING_SECRET!,
    });

    if (event.type === "user.created") {
        const userId = event.data.id;
        const email = event.data.email_addresses[0].email_address;

        await prisma.user.upsert({
            where: { clerkId: userId },
            update: {},
            create: { clerkId: userId, email },
        });
    };

    return new Response("Webhook received", { status: 200 });
};

