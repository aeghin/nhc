import { notFound } from "next/navigation";
// import { getOrgSongCatalog } from "@/lib/services/songs"
import { SetlistEditor } from "@/components/dashboard/events/setlist-editor";

import { currentUser } from "@/lib/services/user";
import { getUserMembershipRole } from "@/lib/services/organization";
import { getEventDetailsById } from "@/lib/services/events";
import { OrgRole } from "@/generated/prisma/enums";
import type { SetlistSong } from "@/lib/types";
import { getOrganizationSongs } from "@/lib/services/songs";
import { getAiSetlistAccess } from "@/lib/billing/entitlements";


interface PageProps {
  params: Promise<{ id: string; eventId: string }>
};

export default async function SetlistEditPage({ params }: PageProps) {

  const { id: orgId, eventId } = await params;

  const user = await currentUser();

  if (!user) notFound();

  const [membership, event, catalog] = await Promise.all([
    getUserMembershipRole(user.id, orgId),
    getEventDetailsById(eventId, orgId),
    getOrganizationSongs(orgId),
  ]);

  const canManage =
    membership?.role === OrgRole.ADMIN || membership?.role === OrgRole.OWNER;

  const canSubscribe = membership?.role === OrgRole.OWNER;

  if (!event || !canManage) notFound();

  const canUseAi = await getAiSetlistAccess({ userId: user.id, orgId });

  const backHref = `/dashboard/organizations/${orgId}/events/${eventId}`;

  const initialSongs: SetlistSong[] = event.setlistSongs.map((s) => ({
      id: s.id,
      songId: s.songId,
      position: s.position,
      pitch: s.pitch,
      keyQuality: s.keyQuality,
      bpm: s.bpm,
      timeSignature: s.timeSignature,
      title: s.song.title,
      artist: s.song.artist,
      youtubeUrl: s.song.youtubeUrl,
      spotifyUrl: s.song.spotifyUrl,
    }));

  return (
    <SetlistEditor
      eventId={event.id}
      eventName={event.name}
      orgId={orgId}
      backHref={backHref}
      initialSongs={initialSongs}
      catalog={catalog}
      canUseAi={canUseAi}
      canSubscribe={canSubscribe}
    />
  )
}