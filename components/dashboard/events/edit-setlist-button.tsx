"use client"

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SetlistEditorModal } from "./setlist-editor-modal";
import type { SetlistSong } from "@/lib/types";

interface EditSetlistButtonProps {
  eventId: string
  eventName: string
  initialSongs: SetlistSong[]
}

export function EditSetlistButton({
  eventId,
  eventName,
  initialSongs,
}: EditSetlistButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Pencil className="mr-1 h-3.5 w-3.5" />
        Edit
      </Button>
      <SetlistEditorModal
        open={open}
        onOpenChange={setOpen}
        eventId={eventId}
        eventName={eventName}
        initialSongs={initialSongs}
      />
    </>
  )
}