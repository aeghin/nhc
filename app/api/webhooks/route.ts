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
    const firstName = event.data.first_name!;
    const lastName = event.data.last_name!;
    const phoneNumber = event.data.phone_numbers[0].phone_number;
    const userImageUrl = event.data.image_url;

    await prisma.user.upsert({
      where: { clerkId: userId },
      update: {},
      create: {
        clerkId: userId,
        email,
        firstName,
        lastName,
        phoneNumber,
        userImageUrl,
      },
    });
  }

  if (event.type === "user.updated") {
    const {
      id,
      email_addresses,
      first_name,
      last_name,
      image_url,
      phone_numbers,
    } = event.data;

    const existingUser = await prisma.user.findUnique({
      where: { clerkId: id },
    });

    if (!existingUser) return;

    const primaryEmail = email_addresses.find(
      (e) => e.id === event.data.primary_email_address_id,
    )?.email_address;
    const primaryPhone = phone_numbers.find(
      (p) => p.id === event.data.primary_phone_number_id,
    )?.phone_number;

    const updates: Record<string, string | undefined> = {};

    if (primaryEmail && primaryEmail !== existingUser.email)
      updates.email = primaryEmail;
    if (first_name && first_name !== existingUser.firstName)
      updates.firstName = first_name;
    if (last_name && last_name !== existingUser.lastName)
      updates.lastName = last_name;
    if (image_url !== existingUser.userImageUrl) updates.userImageUrl = image_url;
    if (primaryPhone && primaryPhone !== existingUser.phoneNumber)
      updates.phoneNumber = primaryPhone;

    if (Object.keys(updates).length > 0) {
      await prisma.user.update({
        where: { clerkId: id },
        data: updates,
      });
    }
  }

  return new Response("Webhook received", { status: 200 });
}
