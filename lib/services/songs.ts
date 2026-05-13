import "server-only"

import prisma from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

export const getOrganizationSongs = async (organizationId: string) => {

    "use cache"

    cacheLife("hours");

    cacheTag(`org-${organizationId}-songs`);

    const songs = await prisma.song.findMany({
      where: {
        organizationId,
        deletedAt: null,
      },
      orderBy: { title: "asc" }
    });

    return songs;
};