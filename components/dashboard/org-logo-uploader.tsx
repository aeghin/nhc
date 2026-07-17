"use client"

import { useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ImageIcon, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

import { useUploadThing } from "@/lib/uploadthing";
import { updateOrganizationLogo, removeOrganizationLogo } from "@/lib/actions/organizations";

interface OrgLogoUploaderProps {
    organizationId: string;
    logoUrl: string | null;
    isOwner: boolean;
};

export const OrgLogoUploader = ({ organizationId, logoUrl, isOwner }: OrgLogoUploaderProps) => {

    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSaving, startSaving] = useTransition();

    const { startUpload, isUploading } = useUploadThing("orgLogo", {
        onClientUploadComplete: (uploaded) => {
            startSaving(async () => {
                const file = uploaded[0];

                const result = await updateOrganizationLogo(organizationId, {
                    url: file.ufsUrl,
                    key: file.key,
                });

                if (result.success) {
                    toast.success("Logo updated!", { position: "top-center" });
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

    const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;
        startUpload([file], { organizationId });
    };

    const handleRemove = () => {
        startSaving(async () => {
            const result = await removeOrganizationLogo(organizationId);

            if (result.success) {
                toast.success("Logo removed", { position: "top-center" });
                router.refresh();
            } else {
                toast.error(result.error, { position: "top-center" });
            }
        });
    };

    return (
        <section className="rounded-xl border border-border/40 bg-secondary/10 p-5">
            <h3 className="text-sm font-semibold">Organization Logo</h3>
            <p className="mt-1 text-xs text-muted-foreground">
                {isOwner
                    ? "Shown on your organization's card and page header. PNG or JPG, up to 4MB."
                    : "Shown on your organization's card and page header."}
            </p>

            <div className="mt-4 flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/40 bg-primary/10">
                    {logoUrl ? (
                        <img
                            src={logoUrl}
                            alt="Organization logo"
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <ImageIcon className="h-6 w-6 text-primary" />
                    )}
                </div>

                {isOwner && (
                    <div className="flex flex-wrap items-center gap-2">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileSelected}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isBusy}
                        >
                            {isBusy ? <Spinner className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
                            {isUploading ? "Uploading..." : isSaving ? "Saving..." : logoUrl ? "Replace logo" : "Upload logo"}
                        </Button>
                        {logoUrl && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="gap-2 text-muted-foreground hover:text-destructive"
                                onClick={handleRemove}
                                disabled={isBusy}
                            >
                                <Trash2 className="h-4 w-4" />
                                Remove
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};
