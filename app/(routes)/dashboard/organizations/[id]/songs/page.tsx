
import { Suspense } from "react";

import { SongLibraryData } from "@/components/dashboard/songs/song-library-data";
import { SongLibrarySkeleton } from "@/components/dashboard/songs/song-library-skeleton"

export default async function SongsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: orgId } = await params;


  return (
    <Suspense fallback={<SongLibrarySkeleton />}>
      <SongLibraryData orgId={orgId} />
    </Suspense>
  )
}
