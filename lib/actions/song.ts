"use server"

import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/services/user";
import { type songSchemaInput, songSchema } from "@/lib/validations/song";
import { OrgRole } from "@/generated/prisma/enums";
import { revalidatePath, updateTag } from "next/cache";
import { Prisma } from "@/generated/prisma/client";


type ActionResponse = { success: true } | { success: false; error: string };

export const addSongToLibrary = async (song: songSchemaInput): Promise<ActionResponse> => {

    try {

    const user = await currentUser();

    if (!user) return { success: false, error: "Unauthorized" };

    const parsed = songSchema.safeParse(song);

    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

   const { title, artist, bpm, timeSignature, defaultPitch, defaultKeyQuality, spotifyUrl, youtubeUrl, themes, organizationId } = parsed.data;

    const membership = await prisma.membership.findUnique({
        where: {
            userId_organizationId: {
                userId: user.id,
                organizationId
            }
        }
    }); 

    if (!membership) return { success: false, error: "Unable to locate membership" };

    if (membership.role === OrgRole.MEMBER) return { success: false, error: "Unauthorized" };

    const songExists = await prisma.song.findUnique({
        where: {
            organizationId_title_artist: {
                organizationId,
                title,
                artist
            }
        }
    });

    if (songExists && songExists.deletedAt === null) {
        return { success: false, error: "Song already exists" };
    };

    if (songExists) {
        await prisma.song.update({
            where: { id: songExists.id },
            data: {
                bpm,
                timeSignature,
                defaultPitch,
                defaultKeyQuality,
                spotifyUrl,
                youtubeUrl,
                themes,
                deletedAt: null
            }
        });
    } else {
        await prisma.song.create({
            data: {
                title,
                artist,
                bpm,
                timeSignature,
                defaultPitch,
                defaultKeyQuality,
                spotifyUrl,
                youtubeUrl,
                themes,
                organizationId
            }
        });
    };

    updateTag(`org-${organizationId}-songs`);
    revalidatePath(`/dashboard/organizations/${organizationId}/songs`);

    return { success: true };


    } catch (err) {
        console.log(err);
        return { success: false, error: "Something went wrong. Try Again" }
    }

}


    export const updateSongInLibrary = async (songId: string, song: songSchemaInput): Promise<ActionResponse> => {

        try {

            const user = await currentUser();

            if (!user) return { success: false, error: "Unauthorized" };

            const parsed = songSchema.safeParse(song);

            if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

            const { title, artist, bpm, timeSignature, defaultPitch, defaultKeyQuality, spotifyUrl, youtubeUrl, themes, organizationId } = parsed.data;

            const membership = await prisma.membership.findUnique({
                where: {
                    userId_organizationId: {
                        userId: user.id,
                        organizationId
                    }
                }
            }); 

            if (!membership) return { success: false, error: "Unable to locate membership" };

            if (membership.role === OrgRole.MEMBER) return { success: false, error: "Unauthorized" };

            const songExistsInOrganization = await prisma.song.findUnique({
                where: {
                    id: songId,
                    organizationId: organizationId,
                    deletedAt: null
                }
            });

            if (!songExistsInOrganization) return { success: false, error: "Song not found." };

            await prisma.song.update({
              where: { id: songId, organizationId },
              data: { title, artist, bpm, timeSignature, defaultPitch, defaultKeyQuality, spotifyUrl, youtubeUrl, themes }
            });


            updateTag(`org-${organizationId}-songs`);
            revalidatePath(`/dashboard/organizations/${organizationId}/songs`);

  return { success: true };

  } catch (err) {

      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
          return { success: false, error: "A song with this title and artist already exists" };
      }
      console.log(err);
      return { success: false, error: "Something went wrong, try again." };
  }
}