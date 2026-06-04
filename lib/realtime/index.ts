import "server-only";

import { ablyAdapter } from "./ably-adapter";
import type { RealtimeAdapter } from "./types";

// Swap transports here (or by env): pusherAdapter / partykitAdapter later.
// The action only ever imports `publishMessage` from this module.
const adapter: RealtimeAdapter = ablyAdapter;

export const publishMessage = adapter.publishMessage;
