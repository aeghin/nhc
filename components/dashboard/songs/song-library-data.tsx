import { notFound, redirect } from "next/navigation";
import { SongLibrary } from "@/components/dashboard/songs/song-library";


import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/services/user";
import { OrgRole } from "@/generated/prisma/enums";


export async function SongLibraryData({ orgId }: { orgId: string }) {

    const user = await currentUser();

    if (!user) redirect ("/sign-in");
  
    const [org, songs] = await Promise.all([
    prisma.organization.findUnique({
        where: {
            id: orgId
        },
        select: {
            name: true,
            memberships: {
                where: {
                    userId: user.id
                },
                select: {
                    role: true
                }
            }
        }
    }),
    prisma.song.findMany({
        where: {
            organizationId: orgId
        },
        omit: {
            organizationId: true,
            deletedAt: true,
            createdAt: true,
            updatedAt: true
        }
    })
  ]);

  if (!org) notFound();

  const currentUserRole = org.memberships[0].role;

  const canManage = currentUserRole === OrgRole.OWNER || currentUserRole === OrgRole.ADMIN;

  return (
    <SongLibrary
      songs={songs}
      orgId={orgId}
      orgName={org.name}
      canManage={canManage}
    />
  )
}