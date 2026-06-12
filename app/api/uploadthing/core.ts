import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod/v4";

import prisma from "@/lib/prisma";
import { OrgRole } from "@/generated/prisma/enums";

const f = createUploadthing();

export const fileRouter = {
    songAttachment: f({
        pdf: { maxFileSize: "16MB", maxFileCount: 5 },
        audio: { maxFileSize: "64MB", maxFileCount: 5 },
    })
        .input(z.object({ songId: z.uuid() }))
        .middleware(async ({ input }) => {
            const { userId: clerkId } = await auth();

            if (!clerkId) throw new UploadThingError("Unauthorized");

            const user = await prisma.user.findUnique({ where: { clerkId } });

            if (!user) throw new UploadThingError("Unauthorized");

            const song = await prisma.song.findUnique({
                where: { id: input.songId, deletedAt: null },
            });

            if (!song) throw new UploadThingError("Song not found");

            const membership = await prisma.membership.findUnique({
                where: {
                    userId_organizationId: {
                        userId: user.id,
                        organizationId: song.organizationId,
                    },
                },
            });

            if (!membership || membership.role === OrgRole.MEMBER) {
                throw new UploadThingError("Unauthorized");
            }

            return { songId: song.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log(`Upload complete for song ${metadata.songId}: ${file.key}`);
        }),
} satisfies FileRouter;

export type SongFileRouter = typeof fileRouter;
