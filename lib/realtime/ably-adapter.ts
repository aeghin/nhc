import "server-only";

import * as Ably from "ably";
import type { RealtimeAdapter } from "./types";
import { channelName } from "./channels";

let rest: Ably.Rest | null = null;
function getRest() {
  if (!rest) rest = new Ably.Rest({ key: process.env.ABLY_API_KEY! });
  return rest;
}

export const ablyAdapter: RealtimeAdapter = {
  async publishMessage(eventId, message) {
    await getRest().channels.get(channelName(eventId)).publish("message", message);
  },
};
