import { auth } from "@clerk/nextjs/server"
import { Music, Youtube } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
// import { SetlistEditingControls } from "./setlist-editing-controls"
// import type { Event } from "@/lib/types"

interface EventSetlistSectionProps {
  event: Event
  canManage: boolean
}

export async function EventSetlistSection({
  event,
  canManage,
}: EventSetlistSectionProps) {
  const { has } = await auth()
  const canUseAi = canManage && has({ feature: "ai_setlist_generation" })
  // const songs = event.setlist?.songs ?? []

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <Music className="h-4 w-4 text-primary" />
            Setlist
          </CardTitle>
          {/* {canManage && (
            <SetlistEditingControls
              eventId={event.id}
              eventName={event.name}
              initialSongs={songs}
              canUseAi={canUseAi}
            />
          )} */}
        </div>
      </CardHeader>
      {/* <CardContent> */}
        {/* {songs.length > 0 ? (
          <div className="space-y-1">
            {songs.map((song, idx) => (
              <div
                key={song.id}
                className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted text-[11px] font-bold text-muted-foreground">
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight truncate">
                    {song.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {song.artist}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge
                    variant="outline"
                    className="text-[10px] font-mono px-1.5 py-0"
                  >
                    {song.key}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground font-mono w-12 text-right">
                    {song.bpm} bpm
                  </span>
                  {song.youtubeUrl && (
                    
                      href={song.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                    >
                      <Youtube className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-border/40 bg-muted/10">
            <div className="text-center">
              <Music className="mx-auto mb-1.5 h-6 w-6 text-muted-foreground/30" />
              <p className="text-xs text-muted-foreground">
                {canManage
                  ? "No setlist yet. Click Edit to add songs."
                  : "No setlist added yet."}
              </p>
            </div>
          </div>
        )}
      </CardContent> */}
    </Card>
  )
}