import { z } from "zod/v4";
import { pitchSchema, keyQualitySchema } from "@/lib/constants/key";

const optionalUrl = z.literal("").or(z.url("Enter a valid URL"));

export const songSchema = z.object({
    title: z.string().min(1, "Song title required"),
    artist: z.string().min(1, "Artist name required"),
    bpm: z.number({ error: "BPM is required" }).int().min(1),
    timeSignature: z.string().min(1, "time signature required"),
    defaultPitch: pitchSchema,
    defaultKeyQuality: keyQualitySchema,
    spotifyUrl: optionalUrl,
    youtubeUrl: optionalUrl,
    themes: z
        .string()
        .transform((t) => t.trim().toLowerCase())
        .array()
        .min(1, "Theme selection is required")
        .transform((arr) => [...new Set(arr)]),
    organizationId: z.uuid(),
}).refine((d) => Boolean(d.spotifyUrl || d.youtubeUrl), {
    message: "Add a Spotify or YouTube link",
    path: ["spotifyUrl"],
});

export type songSchemaInput = z.infer<typeof songSchema>;

export const songAttachmentsSchema = z.object({
    songId: z.uuid(),
    organizationId: z.uuid(),
    files: z.object({
        name: z.string().min(1, "File name required"),
        url: z.url("File URL required"),
        key: z.string().min(1, "File key required"),
        type: z.string().min(1, "File type required"),
        size: z.number().int().min(0),
    }).array().min(1, "At least one file is required").max(10),
});

export type songAttachmentsInput = z.infer<typeof songAttachmentsSchema>;