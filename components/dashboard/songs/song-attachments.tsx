"use client"

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AudioLines, FileText, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { useUploadThing } from "@/lib/uploadthing";
import { addSongAttachments, deleteSongAttachment } from "@/lib/actions/song";

import type { SongAttachment } from "@/lib/types";

interface SongAttachmentsProps {
    songId: string;
    organizationId: string;
    attachments: SongAttachment[];
};

const formatFileSize = (bytes: number) => {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
};

export const SongAttachments = ({ songId, organizationId, attachments }: SongAttachmentsProps) => {

    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isSaving, startSaving] = useTransition();

    const { startUpload, isUploading } = useUploadThing("songAttachment", {
        onClientUploadComplete: (uploaded) => {
            startSaving(async () => {
                const result = await addSongAttachments({
                    songId,
                    organizationId,
                    files: uploaded.map((file) => ({
                        name: file.name,
                        url: file.ufsUrl,
                        key: file.key,
                        type: file.type,
                        size: file.size,
                    })),
                });

                if (result.success) {
                    toast.success("Attachment added 📎", { position: "top-center" });
                    router.refresh();
                } else {
                    toast.error(result.error, { position: "top-center" });
                }
            });
        },
        onUploadError: (error) => {
            toast.error(error.message, { position: "top-center" });
        },
    });

    const isBusy = isUploading || isSaving;

    const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        e.target.value = "";
        if (files.length === 0) return;
        startUpload(files, { songId });
    };

    const handleDelete = (attachmentId: string) => {
        setDeletingId(attachmentId);
        startSaving(async () => {
            const result = await deleteSongAttachment(attachmentId, organizationId);

            if (result.success) {
                toast.success("Attachment removed", { position: "top-center" });
                router.refresh();
            } else {
                toast.error(result.error, { position: "top-center" });
            }
            setDeletingId(null);
        });
    };

    return (
        <div className="space-y-2">
            <p className="text-sm font-medium">Attachments</p>

            {attachments.length === 0 ? (
                <p className="text-xs text-muted-foreground">No attachments uploaded yet.</p>
            ) : (
                <ul className="space-y-1.5">
                    {attachments.map((attachment) => {
                        const isPdf = attachment.type === "application/pdf";
                        const Icon = isPdf ? FileText : AudioLines;

                        return (
                            <li
                                key={attachment.id}
                                className="flex items-center gap-2 rounded-md border bg-background px-2.5 py-2"
                            >
                                <Icon
                                    className={cn(
                                        "h-4 w-4 shrink-0",
                                        isPdf ? "text-red-500" : "text-sky-500",
                                    )}
                                />
                                <a
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="min-w-0 flex-1 truncate text-sm hover:underline"
                                >
                                    {attachment.name}
                                </a>
                                <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                                    {formatFileSize(attachment.size)}
                                </span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                    onClick={() => handleDelete(attachment.id)}
                                    disabled={isBusy}
                                    aria-label={`Remove ${attachment.name}`}
                                >
                                    {deletingId === attachment.id ? (
                                        <Spinner className="h-3.5 w-3.5" />
                                    ) : (
                                        <Trash2 className="h-3.5 w-3.5" />
                                    )}
                                </Button>
                            </li>
                        );
                    })}
                </ul>
            )}

            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="application/pdf,.pdf,audio/*"
                className="hidden"
                onChange={handleFilesSelected}
            />
            <Button
                type="button"
                variant="outline"
                className="w-full gap-2 border-dashed"
                onClick={() => fileInputRef.current?.click()}
                disabled={isBusy}
            >
                {isBusy ? <Spinner className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
                {isUploading ? "Uploading..." : isSaving ? "Saving..." : "Upload PDF or audio"}
            </Button>
            <p className="text-xs text-muted-foreground">
                Chord charts (PDF, up to 16MB) and audio like MP3, WAV or M4A (up to 64MB).
            </p>
        </div>
    );
};
