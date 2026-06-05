import { z } from "zod/v4";
import { pitchSchema, keyQualitySchema } from "@/lib/constants/key";

export const songSchema = z.object({
    title: z.string().min(1, "Song title required"),
    artist: z.string().min(1, "Artist name required"),
    bpm: z.number({ error: "BPM is required" }).int().min(1),
    timeSignature: z.string().min(1, "time signature required"),
    defaultPitch: pitchSchema,
    defaultKeyQuality: keyQualitySchema,
    spotifyUrl: z.url().min(1, "Linked required"),
    youtubeUrl: z.url().min(1, "Linked required"),
    themes: z.string().array().min(1, "Theme selection is required"),
    organizationId: z.uuid(),
})

export type songSchemaInput = z.infer<typeof songSchema>