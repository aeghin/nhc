import prisma from "@/lib/prisma";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { OrgRole } from "@/generated/prisma/enums";
import { UTApi } from "uploadthing/server";

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

    if (!existingUser) return new Response("Unable to find user", { status: 404 });

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

      revalidateTag(`user-${id}`, { expire: 0 });

      const memberships = await prisma.membership.findMany({
        where: { user: { clerkId: id } },
        select: { organizationId: true },
      });

      for (const { organizationId } of memberships) {
        revalidateTag(`org-${organizationId}-members-list`, { expire: 0 });
      }
    }
  }


  if (event.type === "user.deleted") {
    const clerkId = event.data.id;

    // The deleted payload types `id` as optional.
    if (!clerkId) return new Response("Webhook received", { status: 200 });

    // Everything the cache tags need must be read before the cascade runs.
    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: {
        id: true,
        email: true,
        memberships: { select: { organizationId: true, role: true } },
        assignedEvents: { select: { eventId: true, organizationId: true } },
        setlistSongAssignment: {
          select: {
            setlistSong: {
              select: { eventId: true, event: { select: { organizationId: true } } },
            },
          },
        },
      },
    });

    // Already gone, or never synced. 200 so Clerk stops redelivering.
    if (!user) return new Response("Webhook received", { status: 200 });

    const orgIds = user.memberships.map((m) => m.organizationId);

    // Assignment rosters and setlist credits both render through the same
    // event-details tag, so they feed one set.
    const eventOrgById = new Map<string, string>();
    for (const a of user.assignedEvents) eventOrgById.set(a.eventId, a.organizationId);
    for (const s of user.setlistSongAssignment)
      eventOrgById.set(s.setlistSong.eventId, s.setlistSong.event.organizationId);

    // Invites addressed to this email can sit in orgs they never joined.
    const invitedOrgs = await prisma.invitation.findMany({
      where: { email: user.email },
      select: { organizationId: true },
    });

    // Orgs this user solely owned: promote a successor, or tear the org down if
    // they were the last member.
    const promotions: { userId: string; organizationId: string }[] = [];
    const doomedOrgIds: string[] = [];

    for (const { organizationId, role } of user.memberships) {
      if (role !== OrgRole.OWNER) continue;

      const otherOwners = await prisma.membership.count({
        where: { organizationId, role: OrgRole.OWNER, userId: { not: user.id } },
      });
      if (otherOwners > 0) continue;

      const successor =
        (await prisma.membership.findFirst({
          where: { organizationId, role: OrgRole.ADMIN },
          orderBy: { createdAt: "asc" },
          select: { userId: true },
        })) ??
        (await prisma.membership.findFirst({
          where: { organizationId, role: OrgRole.MEMBER },
          orderBy: { createdAt: "asc" },
          select: { userId: true },
        }));

      if (successor) promotions.push({ userId: successor.userId, organizationId });
      else doomedOrgIds.push(organizationId);
    }

    // UploadThing keys have to be collected before the rows go.
    const doomedOrgs = doomedOrgIds.length
      ? await prisma.organization.findMany({
          where: { id: { in: doomedOrgIds } },
          select: {
            logoKey: true,
            songs: { select: { attachments: { select: { key: true } } } },
          },
        })
      : [];

    await prisma.$transaction([
      // Promote before the owner's membership cascades away.
      ...promotions.map(({ userId, organizationId }) =>
        prisma.membership.update({
          where: { userId_organizationId: { userId, organizationId } },
          data: { role: OrgRole.OWNER },
        }),
      ),
      // Invitations addressed to this user carry no FK, only an email string.
      prisma.invitation.deleteMany({ where: { email: user.email } }),
      // Cascades: Membership, EventAssignment, BlockoutDate, Message,
      // SetlistSongAssignment, and the invitations they sent.
      prisma.user.delete({ where: { id: user.id } }),
      // ServiceType and Song are RESTRICT-referenced, so children go first —
      // same order deleteOrganization uses.
      ...doomedOrgIds.flatMap((organizationId) => [
        prisma.event.deleteMany({ where: { organizationId } }),
        prisma.song.deleteMany({ where: { organizationId } }),
        prisma.eventTemplate.deleteMany({ where: { organizationId } }),
        prisma.serviceType.deleteMany({ where: { organizationId } }),
        prisma.organization.delete({ where: { id: organizationId } }),
      ]),
    ]);

    const utKeys = doomedOrgs.flatMap((o) => [
      ...(o.logoKey ? [o.logoKey] : []),
      ...o.songs.flatMap((s) => s.attachments.map((a) => a.key)),
    ]);

    // Best effort — orphaned files must not fail an otherwise-complete delete.
    if (utKeys.length) {
      try {
        await new UTApi().deleteFiles(utKeys);
      } catch (err) {
        console.error("user.deleted: UploadThing cleanup failed", err);
      }
    }

    revalidateTag(`user-${clerkId}`, { expire: 0 });
    revalidateTag(`user-${user.id}-orgs`, { expire: 0 });
    revalidateTag(`user-${user.id}-memberships`, { expire: 0 });
    revalidateTag(`user-${user.id}-roles`, { expire: 0 });

    for (const organizationId of orgIds) {
      revalidateTag(`user-${user.id}-org-${organizationId}-role`, { expire: 0 });
      revalidateTag(`user-${user.id}-events-${organizationId}`, { expire: 0 });
      revalidateTag(`user-${user.id}-blockouts-${organizationId}`, { expire: 0 });
      revalidateTag(`user-${user.id}-songs-${organizationId}`, { expire: 0 });
      revalidateTag(`org-${organizationId}-members-list`, { expire: 0 });
      revalidateTag(`org-${organizationId}-member-count`, { expire: 0 });
      revalidateTag(`org-${organizationId}-list-entry`, { expire: 0 });
      revalidateTag(`org-${organizationId}-acceptance-stats`, { expire: 0 });
      revalidateTag(`org-${organizationId}-events`, { expire: 0 });
    }

    for (const { organizationId } of [...user.memberships, ...invitedOrgs]) {
      revalidateTag(`invitations-${organizationId}-list`, { expire: 0 });
    }

    for (const [eventId, organizationId] of eventOrgById) {
      revalidateTag(`event-${eventId}-org-${organizationId}-details`, { expire: 0 });
    }

    for (const { userId, organizationId } of promotions) {
      revalidateTag(`user-${userId}-org-${organizationId}-role`, { expire: 0 });
      revalidateTag(`user-${userId}-orgs`, { expire: 0 });
    }
  }

  return new Response("Webhook received", { status: 200 });
}
