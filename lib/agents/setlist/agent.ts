import { ToolLoopAgent, tool, InferAgentUIMessage } from "ai";
import { Pitch, KeyQuality } from "@/generated/prisma/enums";
import { proposeSetlistInputSchema } from "./schema";

// Minimal view of a catalog song the agent reasons over (org-scoped).
export type AgentCatalogSong = {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  timeSignature: string;
  defaultPitch: Pitch;
  defaultKeyQuality: KeyQuality;
  themes: string[];
  spotifyUrl: string;
  youtubeUrl: string;
};

// Shape the client applies into the draft (mirrors SetlistSong fields).
export type ProposedSetlistSong = {
  songId: string;
  title: string;
  artist: string;
  bpm: number;
  timeSignature: string;
  pitch: Pitch;
  keyQuality: KeyQuality;
  spotifyUrl: string | null;
  youtubeUrl: string | null;
  reason: string;
};

function buildInstructions(orgName: string, catalog: AgentCatalogSong[]) {
  const rows = catalog
    .map(
      (s) =>
        `- ${s.id} | "${s.title}" — ${s.artist} | key ${s.defaultPitch}/${s.defaultKeyQuality} | ${s.bpm}bpm ${s.timeSignature} | themes: ${s.themes.join(", ") || "—"}`,
    )
    .join("\n");

  return `You are a setlist assistant for "${orgName}". You help a worship/music leader build an event setlist using ONLY this organization's song catalog.

CATALOG (id | title — artist | key | tempo | themes):
${rows}

How to work:
- Choose songs strictly by their exact id from the catalog above. Never invent songs or ids.
- Use each song's themes to match what the user asks for (e.g. "communion", "surrender", "Christmas").
- Think about flow: key compatibility between adjacent songs, a sensible tempo/energy arc, and theme coherence.
- Keep each song in its catalog key unless the user asks to transpose.
- Explain your thinking briefly in chat (1–3 sentences), then ALWAYS call the proposeSetlist tool to deliver the list — never write the final setlist as plain text.
- If the catalog is too small or lacks fitting songs, say so honestly instead of forcing it.`;
}

export function createSetlistAgent(opts: {
  orgName: string;
  catalog: AgentCatalogSong[];
}) {
  const { orgName, catalog } = opts;
  const byId = new Map(catalog.map((s) => [s.id, s]));

  const proposeSetlist = tool({
    description:
      "Deliver a finished setlist for the user to review and apply. Call this once you've settled on the songs.",
    inputSchema: proposeSetlistInputSchema,
    // Runs on the server: validates every id against the org catalog and
    // hydrates real metadata. The model cannot smuggle in foreign songs.
    execute: async ({ title, songs }) => {
      const resolved: ProposedSetlistSong[] = [];
      const skipped: string[] = [];
      const seen = new Set<string>();

      for (const item of songs) {
        const song = byId.get(item.songId);
        if (!song || seen.has(item.songId)) {
          skipped.push(item.songId);
          continue;
        }
        seen.add(item.songId);
        resolved.push({
          songId: song.id,
          title: song.title,
          artist: song.artist,
          bpm: song.bpm,
          timeSignature: song.timeSignature,
          pitch: item.pitch ?? song.defaultPitch,
          keyQuality: item.keyQuality ?? song.defaultKeyQuality,
          spotifyUrl: song.spotifyUrl || null,
          youtubeUrl: song.youtubeUrl || null,
          reason: item.reason,
        });
      }

      return { title, songs: resolved, skipped };
    },
  });

  return new ToolLoopAgent({
    model: "anthropic/claude-haiku-4.5",
    instructions: buildInstructions(orgName, catalog),
    tools: { proposeSetlist },
  });
}

export type SetlistAgentUIMessage = InferAgentUIMessage<
  ReturnType<typeof createSetlistAgent>
>;
