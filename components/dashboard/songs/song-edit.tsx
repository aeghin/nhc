"use client"

import { useState } from "react";
import { EllipsisVertical, Pencil } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { SongModal } from "@/components/dashboard/songs/song-modal";

import type { LibrarySong } from "@/lib/types";

interface EditSongDetailsProps {
    song: LibrarySong;
    orgId: string;
};

export const EditSongDetails = ({ song, orgId }: EditSongDetailsProps) => {

    const [open, setOpen] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground"
                    >
                        <EllipsisVertical className="h-4 w-4" />
                        <span className="sr-only">Song actions</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                        onSelect={(e) => {
                            e.preventDefault();
                            setOpen(true);
                        }}
                    >
                        <Pencil className="h-4 w-4" />
                        Edit details
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <SongModal
                orgId={orgId}
                song={song}
                open={open}
                onOpenChange={setOpen}
            />
        </>
    );
};
