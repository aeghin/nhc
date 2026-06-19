import { z } from "zod";
import { Pitch, KeyQuality } from "@/generated/prisma/enums";

// What the model is allowed to send when it proposes a setlist.
// It only picks songId + (optional) key; everything else is hydrated
// server-side from the catalog, so the model can't invent metadata.
export const proposeSetlistInputSchema = z.object({
  title: z
    .string()
    .describe('Short name for this proposal, e.g. "Sunday AM — Surrender".'),
  songs: z
    .array(
      z.object({
        songId: z
          .string()
          .describe("Exact id of a song from the provided catalog."),
        pitch: z
          .enum(Pitch)
          .optional()
          .describe(
            "Only set to transpose; omit to use the catalog default key.",
          ),
        keyQuality: z.enum(KeyQuality).optional(),
        reason: z
          .string()
          .describe("One short sentence: why this song, here, in the flow."),
      }),
    )
    .min(1)
    .describe("Songs in playing order."),
});

export type ProposeSetlistInput = z.infer<typeof proposeSetlistInputSchema>;
