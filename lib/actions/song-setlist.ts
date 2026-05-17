"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/services/user";
import { OrgRole } from "@/generated/prisma/enums";
import { revalidatePath, updateTag } from "next/cache";
import type { SetlistSong } from "@/lib/types";

type ActionResponse = { success: true } | { success: false; error: string };

export const saveSetlist = async (
  eventId: string,
  songs: SetlistSong[],
): Promise<ActionResponse> => {
  try {
    const user = await currentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        organization: {
          memberships: {
            some: {
              userId: user.id,
              role: { in: [OrgRole.OWNER, OrgRole.ADMIN] },
            },
          },
        },
      },
      select: { organizationId: true },
    });

    if (!event) return { success: false, error: "Unauthorized" };

    const { organizationId } = event;

    if (songs.length > 0) {
      const songIds = songs.map((s) => s.songId);
      const uniqueSongIds = new Set(songIds);

      if (uniqueSongIds.size !== songIds.length) {
        return { success: false, error: "Duplicate songs in setlist" };
      };

      const validSongs = await prisma.song.count({
        where: {
          id: { in: songIds },
          organizationId,
          deletedAt: null,
        },
      });

      if (validSongs !== uniqueSongIds.size) {
        return {
          success: false,
          error: "One or more songs do not belong to this organization",
        };
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.setlistSong.deleteMany({ where: { eventId } });

      if (songs.length > 0) {
        await tx.setlistSong.createMany({
          data: songs.map((s, idx) => ({
            eventId,
            songId: s.songId,
            position: idx,
            pitch: s.pitch,
            keyQuality: s.keyQuality,
            bpm: s.bpm,
            timeSignature: s.timeSignature,
          })),
        });
      }
    });

    updateTag(`event-${eventId}-org-${organizationId}-details`);
    revalidatePath(`/dashboard/organizations/${organizationId}/events/${eventId}`);
    revalidatePath(`/dashboard/organizations/${organizationId}/events/${eventId}/setlist/editor`);

    return { success: true };
  } catch {
    return { success: false, error: "Unable to save setlist" };
  }
};
