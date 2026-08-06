"use client"

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SetlistEditorModal } from "./setlist-editor-modal";
import { cn } from "@/lib/utils";
import { colorClasses } from "@/lib/config/service-types-config";
import type { SetlistSong } from "@/lib/types";

interface EditSetlistButtonProps {
  eventId: string
  eventName: string
  initialSongs: SetlistSong[]
  serviceColor: string
}

export function EditSetlistButton({
  eventId,
  eventName,
  initialSongs,
  serviceColor,
}: EditSetlistButtonProps) {
  const [open, setOpen] = useState(false)
  const serviceColors = colorClasses[serviceColor]

  return (
    <>
      <Button
        size="sm"
        className={cn(serviceColors.solid, serviceColors.solidHover)}
        onClick={() => setOpen(true)}
      >
        <Pencil className="mr-1 h-3.5 w-3.5" />
        Edit
      </Button>
      <SetlistEditorModal
        open={open}
        onOpenChange={setOpen}
        eventId={eventId}
        eventName={eventName}
        initialSongs={initialSongs}
        serviceColor={serviceColor}
      />
    </>
  )
}