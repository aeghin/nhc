"use client"

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { saveSetlist } from "@/lib/actions/song-setlist";
import { SetlistDraft } from "./setlist-draft";
import { CatalogPicker } from "./song-catalog-picker";
// import { AiSetlistPanel } from "./ai-setlist-panel";
import type { SetlistSong } from "@/lib/types";
import { Song } from "@/generated/prisma/client";

interface SetlistEditorProps {
  eventId: string
  eventName: string
  orgId: string
  backHref: string
  initialSongs: SetlistSong[]
  catalog: Song[]
  canUseAi: boolean
}

export function SetlistEditor({
  eventId,
  eventName,
  backHref,
  initialSongs,
  catalog,
  canUseAi,
}: SetlistEditorProps) {
  const router = useRouter();
  const [songs, setSongs] = useState<SetlistSong[]>(initialSongs);
  const [isDirty, setIsDirty] = useState(false);
  const [isPending, startTransition] = useTransition();

  const allKeysSet = songs.every((s) => s.pitch && s.keyQuality);
  const canSave = isDirty && allKeysSet;

  const handleSave = () => {

  startTransition(async () => {
    const result = await saveSetlist(eventId, songs)

    if (result.success) {
      toast.success("Setlist saved")
      setIsDirty(false)
      router.push(backHref)
    } else {
      toast.error(result.error)
    }
  })
};

  const addSongs = (newSongs: SetlistSong[]) => {
    setSongs((prev) => [...prev, ...newSongs]);
    setIsDirty(true)
  };

  const updateSongs = (updatedSongs: SetlistSong[]) => {
    setSongs(updatedSongs)
    setIsDirty(true)
  };
  
  const handleBack = () => {
    startTransition(() => {
      router.push(backHref)
      if (isDirty) {
        setSongs(initialSongs)
        setIsDirty(false)
      }
    })
  };


  return (
    <div className="min-h-screen bg-muted/10">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <Button onClick={handleBack} variant="ghost" size="icon" aria-label="Back to event" className="cursor-pointer">
                <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Setlist Editor</p>
              <h1 className="truncate text-sm font-semibold">{eventName}</h1>
            </div>
          </div>

          <Button size="sm" onClick={handleSave} disabled={!canSave || isPending} className="cursor-pointer">
            <Save className="mr-1.5 h-3.5 w-3.5" />
            Save
          </Button>
        </div>
      </header>

      <div className="container mx-auto grid grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <SetlistDraft songs={songs} onChange={updateSongs} />
        </section>

        <aside className="lg:col-span-1">
          <Tabs defaultValue={canUseAi ? "ai" : "catalog"} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="catalog">Catalog</TabsTrigger>
              <TabsTrigger value="ai">
                <Sparkles />
                AI
              </TabsTrigger>
            </TabsList>
            <TabsContent value="catalog" className="mt-3">
              <CatalogPicker
                catalog={catalog}
                draftSongIds={new Set(songs.map((s) => s.songId))}
                onAdd={addSongs}
              />
            </TabsContent>
            <TabsContent value="ai" className="mt-3">
              {/* <AiSetlistPanel
                eventId={eventId}
                canUseAi={canUseAi}
                onApply={updateSongs}
              /> */}
            </TabsContent>
          </Tabs>
        </aside>
      </div>
    </div>
  )
}