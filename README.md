<div align="center">

<img src="public/aeghin-icon.svg" alt="Aeghin" width="88" height="88">

# Aeghin

**Event planning and volunteer coordination for worship and ministry teams.**

Plan services, assign volunteers to the roles they actually play, build setlists
from your own song catalog — and let AI draft the setlist when you're short on time.

[**aeghin.com**](https://aeghin.com)

</div>

---

## About

Churches and nonprofits run on volunteers, and coordinating them usually means a
spreadsheet, a group text, and a lot of follow-up. Aeghin replaces that.

Organizations invite members by email, tag them with the volunteer roles they can
fill, and schedule them onto events. Members accept or decline their assignments,
mark the dates they're away, and coordinate in a chat thread attached to the event
itself. Music teams get a song library, per-event setlists with transposition and
vocalist assignments, and an optional AI assistant that drafts a setlist from the
organization's own catalog.

Every scheduling feature is free. AI setlist generation is the only paid add-on.

## Features

**Organizations & people**
- Multi-tenant orgs with owner / admin / member roles
- Email invitations with expiring, single-use tokens
- Ten volunteer roles across band, vocals, production, and hospitality

**Scheduling**
- Events with multiple date/time blocks and color-coded service types
- Role-based assignment invites that members accept or decline
- **Event templates** — save a recurring service once, spin up the next one in a click
- **Blockout dates** — members mark time away and are excluded everywhere scheduling happens
- **Smart scheduling** — when someone declines, the next best eligible member for that
  role is invited automatically, skipping anyone with a conflict or an active blockout

**Music**
- Song library with key, BPM, time signature, themes, chart/audio attachments, and streaming links
- Per-event setlists with ordering, transposition, and per-song vocalist assignments
- **AI setlist generation** — describe the service, get an ordered setlist back

**Communication**
- Realtime chat scoped to each event and the volunteers serving on it
- Transactional email for invites, assignments, team messages, and org-wide announcements

## How it works

1. **Create an organization** — or join one from an emailed invite
2. **Invite your team** and tag each person with the roles they can play
3. **Schedule an event**, assign volunteers, and let them confirm
4. **Build the setlist** yourself or hand it to the AI

## Tech stack

Next.js 16 (App Router, Cache Components) · React 19 · TypeScript · Tailwind CSS 4 ·
shadcn/ui · Prisma 7 + PostgreSQL · Clerk · Stripe · Vercel AI SDK + Claude · Ably ·
UploadThing · Resend

## Notes on the build

A few pieces that were more interesting than the CRUD:

- **Smart scheduling** ranks replacement candidates by their historical acceptance
  rate, Laplace-smoothed so a brand-new member isn't penalized for having no track
  record, after filtering out anyone with a time conflict or blockout.
- **The AI setlist agent** hands back its answer through a tool call that runs on the
  server, where every song id is validated against the organization's catalog. The
  model physically cannot put a song into a setlist that the org doesn't own.
- **Realtime chat** issues Ably tokens scoped to a single event's channel, so
  subscribing to someone else's event isn't a client-side check you can bypass.
- **Billing** is driven by Stripe Entitlements mirrored onto the org record, so
  permission checks never make a network call.

## Status

Live and in active use. This repository is a personal project and isn't currently
accepting contributions.
</content>
</invoke>
