"use client"

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { SetlistSong } from "@/lib/types";
import { Song } from "@/generated/prisma/client";

interface CatalogPickerProps {
  catalog: Song[]
  draftSongIds: Set<string>
  onAdd: (songs: SetlistSong[]) => void
}

export function CatalogPicker({
  catalog,
  draftSongIds,
  onAdd,
}: CatalogPickerProps) {
  const [query, setQuery] = useState("")

  const filtered = catalog.filter((s) => {
    const q = query.toLowerCase()
    return (
      s.title.toLowerCase().includes(q) ||
      s.artist.toLowerCase().includes(q)
    )
  })

  const addSong = (song: Song) => {
    const newSetlistSong = {
      id: crypto.randomUUID(),
      songId: song.id,
      title: song.title,
      artist: song.artist,
      pitch: song.defaultPitch ?? undefined,
      keyQuality: song.defaultKeyQuality ?? undefined,
      bpm: song.bpm,
      timeSignature: song.timeSignature,
      spotifyUrl: song.spotifyUrl,
      youtubeUrl: song.youtubeUrl,
      position: 0,
    } as SetlistSong

    onAdd([newSetlistSong])
  }

  return (
    <Card>
      <CardContent className="space-y-3 p-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search songs"
            className="h-8 pl-8 text-xs"
          />
        </div>

        <ScrollArea className="h-105 pr-2">
          <div className="space-y-1">
            {filtered.length === 0 ? (
              <p className="py-8 text-center text-xs text-muted-foreground">
                {catalog.length === 0
                  ? "No songs in catalog yet."
                  : "No songs match."}
              </p>
            ) : (
              filtered.map((song) => {
                const alreadyAdded = draftSongIds.has(song.id)
                return (
                  <div
                    key={song.id}
                    className="flex items-center gap-2 rounded-md p-2 hover:bg-muted/50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium">
                        {song.title}
                      </p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {song.artist} · {song.bpm} bpm · {song.timeSignature}
                      </p>
                    </div>
                    <Button
                      size="icon"
                      variant={alreadyAdded ? "ghost" : "outline"}
                      className="h-7 w-7"
                      disabled={alreadyAdded}
                      onClick={() => addSong(song)}
                      aria-label={
                        alreadyAdded
                          ? "Already added"
                          : `Add ${song.title}`
                      }
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}