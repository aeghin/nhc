"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as Ably from "ably";
import { sendMessage, fetchOlderMessages } from "@/lib/actions/chat";
import { channelName } from "@/lib/realtime/channels";
import type {
  ChatMessage,
  ConnectionStatus,
  PresenceMember,
  UseEventChatOptions,
  UseEventChatReturn,
} from "./types";

export function useEventChat(
  eventId: string,
  { initial, me }: UseEventChatOptions,
): UseEventChatReturn {
  // initial is newest-first from the server; render oldest-first.
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    [...initial].reverse(),
  );
  const [presence, setPresence] = useState<PresenceMember[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const [cursor, setCursor] = useState<string | null>(
    initial.length ? initial[initial.length - 1].id : null,
  );
  const [hasMore, setHasMore] = useState<boolean>(initial.length >= 30);

  // Append with id-dedupe (covers our own echoed publish vs. optimistic temp).
  const upsert = useCallback((incoming: ChatMessage) => {
    setMessages((prev) => {
      if (prev.some((m) => m.id === incoming.id)) return prev;
      return [...prev, incoming];
    });
  }, []);

  useEffect(() => {
    const client = new Ably.Realtime({
      authUrl: `/api/realtime/ably/token?eventId=${eventId}`,
      clientId: me.id,
    });

    client.connection.on("connected", () => setStatus("connected"));
    client.connection.on("disconnected", () => setStatus("disconnected"));
    client.connection.on("suspended", () => setStatus("disconnected"));

    const channel = client.channels.get(channelName(eventId));

    channel.subscribe("message", (msg) => upsert(msg.data as ChatMessage));

    const syncPresence = async () => {
      const members = await channel.presence.get();
      setPresence(
        members.map((p) => ({
          clientId: p.clientId,
          ...(p.data as Omit<PresenceMember, "clientId">),
        })),
      );
    };
    channel.presence.subscribe(["enter", "leave", "present"], syncPresence);
    channel.presence.enter({
      firstName: me.firstName,
      lastName: me.lastName,
      userImageUrl: me.userImageUrl,
    });

    return () => {
      channel.presence.leave();
      channel.unsubscribe();
      client.close();
    };
  }, [eventId, me.id, me.firstName, me.lastName, me.userImageUrl, upsert]);

  const sendOptimistic = useCallback(
    async (body: string) => {
      const tempId = `temp-${crypto.randomUUID()}`;
      const optimistic: ChatMessage = {
        id: tempId,
        body,
        createdAt: new Date().toISOString(),
        author: {
          id: me.id,
          firstName: me.firstName,
          lastName: me.lastName,
          userImageUrl: me.userImageUrl,
        },
      };
      setMessages((prev) => [...prev, optimistic]);

      const res = await sendMessage(eventId, { body });

      setMessages((prev) => {
        if (!res.success) return prev.filter((m) => m.id !== tempId); // roll back
        // Replace temp with persisted; drop dupes if the broadcast already landed.
        const withoutDupe = prev.filter(
          (m) => m.id !== tempId && m.id !== res.message.id,
        );
        return [...withoutDupe, res.message];
      });

      if (!res.success) throw new Error(res.error);
    },
    [eventId, me],
  );

  const loadOlder = useCallback(async () => {
    if (!cursor) return;
    const res = await fetchOlderMessages(eventId, cursor);
    if (!res.success) return;
    // older page is newest-first → reverse and prepend
    setMessages((prev) => [...[...res.messages].reverse(), ...prev]);
    setCursor(res.nextCursor);
    setHasMore(Boolean(res.nextCursor));
  }, [eventId, cursor]);

  return { messages, presence, status, sendOptimistic, loadOlder, hasMore };
}
