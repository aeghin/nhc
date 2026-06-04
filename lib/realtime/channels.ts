// Neutral (no server-only / no "use client") so both the server adapter and
// the client hook can derive the same channel name.
export const channelName = (eventId: string) => `event:${eventId}:chat`;
