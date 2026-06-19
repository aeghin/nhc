"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ArrowUp, Check, Music, Sparkles, Square } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Markdown } from "@/components/ai-chat/markdown";
import { formatKey } from "@/lib/constants/key";
import type { SetlistSong } from "@/lib/types";
import type {
  ProposedSetlistSong,
  SetlistAgentUIMessage,
} from "@/lib/agents/setlist/agent";

const SUGGESTIONS = [
  "Build a 5-song Sunday morning set",
  "Songs about grace, building toward communion",
  "Upbeat opener, then slower worship",
];

interface AiSetlistPanelProps {
  eventId: string;
  orgId: string;
  onApply: (songs: SetlistSong[]) => void;
}

export function AiSetlistPanel({
  eventId,
  orgId,
  onApply,
}: AiSetlistPanelProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, stop, error } =
    useChat<SetlistAgentUIMessage>({
      transport: new DefaultChatTransport({
        api: "/api/setlist-ai",
        body: { eventId, orgId },
      }),
    });

  const isStreaming = status === "submitted" || status === "streaming";
  const hasMessages = messages.length > 0;

  // Keep the latest message in view as tokens stream in.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  function submit() {
    const text = input.trim();
    if (!text || isStreaming) return;
    sendMessage({ text });
    setInput("");
  }

  // Map the server-validated proposal into draft songs (fresh ids + order).
  function applyProposal(songs: ProposedSetlistSong[]) {
    onApply(
      songs.map((s, idx) => ({
        id: crypto.randomUUID(),
        songId: s.songId,
        position: idx,
        pitch: s.pitch,
        keyQuality: s.keyQuality,
        bpm: s.bpm,
        timeSignature: s.timeSignature,
        title: s.title,
        artist: s.artist,
        youtubeUrl: s.youtubeUrl,
        spotifyUrl: s.spotifyUrl,
      })),
    );
  }

  return (
    <Card>
      <CardContent className="flex h-120 flex-col gap-3 p-3">
        <div
          ref={scrollRef}
          className="flex-1 space-y-4 overflow-y-auto pr-1"
        >
          {!hasMessages ? (
            <EmptyState onPick={setInput} />
          ) : (
            messages.map((m) => (
              <div key={m.id} className="space-y-2">
                {m.parts.map((part, i) => {
                  if (part.type === "text") {
                    if (!part.text) return null;
                    return m.role === "user" ? (
                      <UserBubble key={i} text={part.text} />
                    ) : (
                      <div
                        key={i}
                        className="text-xs leading-relaxed text-foreground"
                      >
                        <Markdown>{part.text}</Markdown>
                      </div>
                    );
                  }

                  if (part.type === "tool-proposeSetlist") {
                    switch (part.state) {
                      case "input-streaming":
                      case "input-available":
                        return (
                          <BuildingIndicator key={i} label="Building setlist…" />
                        );
                      case "output-available":
                        return (
                          <ProposalCard
                            key={i}
                            output={part.output}
                            onApply={applyProposal}
                          />
                        );
                      case "output-error":
                        return (
                          <p key={i} className="text-xs text-destructive">
                            Couldn&apos;t build that setlist. Try rephrasing.
                          </p>
                        );
                    }
                  }

                  return null;
                })}
              </div>
            ))
          )}

          {status === "submitted" && <BuildingIndicator label="Thinking…" />}
          {error && (
            <p className="text-xs text-destructive">
              Something went wrong. Please try again.
            </p>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="relative flex items-end gap-2 rounded-xl border border-border bg-card p-1.5 transition-colors focus-within:border-primary/50"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            rows={1}
            placeholder="Describe the setlist…"
            className="max-h-28 min-h-0 flex-1 resize-none border-0 bg-transparent px-2 py-1.5 text-xs shadow-none focus-visible:ring-0 dark:bg-transparent"
          />
          {isStreaming ? (
            <Button
              type="button"
              size="icon"
              variant="secondary"
              onClick={stop}
              className="size-8 shrink-0 cursor-pointer rounded-lg"
              aria-label="Stop"
            >
              <Square className="h-3.5 w-3.5 fill-current" />
            </Button>
          ) : (
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim()}
              className="size-8 shrink-0 cursor-pointer rounded-lg"
              aria-label="Send"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

function ProposalCard({
  output,
  onApply,
}: {
  output: { title: string; songs: ProposedSetlistSong[]; skipped: string[] };
  onApply: (songs: ProposedSetlistSong[]) => void;
}) {
  const [applied, setApplied] = useState(false);

  if (output.songs.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">
        No matching songs found in your catalog.
      </p>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-3 shadow-sm">
      <div className="mb-2 flex items-center gap-2">
        <Music className="h-3.5 w-3.5 text-primary" />
        <p className="truncate text-xs font-semibold">{output.title}</p>
        <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">
          {output.songs.length} songs
        </span>
      </div>

      <ol className="space-y-1.5">
        {output.songs.map((s, idx) => (
          <li key={s.songId} className="flex items-start gap-2 text-xs">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded bg-muted text-[10px] font-bold text-muted-foreground">
              {idx + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">
                {s.title}
                <span className="ml-1 font-mono text-[11px] font-normal text-muted-foreground">
                  · {formatKey(s.pitch, s.keyQuality)} · {s.bpm}bpm
                </span>
              </p>
              <p className="truncate text-[11px] text-muted-foreground">
                {s.reason}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <Button
        size="sm"
        className="mt-3 w-full cursor-pointer"
        onClick={() => {
          onApply(output.songs);
          setApplied(true);
        }}
      >
        {applied ? (
          <>
            <Check className="mr-1.5 h-3.5 w-3.5" />
            Applied to draft
          </>
        ) : (
          "Apply to setlist"
        )}
      </Button>

      {output.skipped.length > 0 && (
        <p className="mt-2 text-[11px] text-muted-foreground">
          {output.skipped.length} suggestion(s) skipped — not in your catalog.
        </p>
      )}
    </div>
  );
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-tr-md bg-primary px-3 py-1.5 text-xs text-primary-foreground">
        {text}
      </div>
    </div>
  );
}

function BuildingIndicator({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <Sparkles className="h-3.5 w-3.5 animate-pulse text-primary" />
      {label}
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="flex flex-col items-center gap-3 py-6 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
        <Sparkles className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-sm font-medium">Generate a setlist</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Describe the vibe — I&apos;ll build it from your song catalog.
        </p>
      </div>
      <div className="w-full space-y-1.5">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onPick(s)}
            className="w-full rounded-lg border border-border bg-card/50 px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
