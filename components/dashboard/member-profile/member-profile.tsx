"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { animate, m, useMotionValue, useTransform } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { OrgRole, VolunteerRole } from "@/generated/prisma/enums";
import { getRoleConfig, volunteerRoleConfig } from "@/lib/config/roles";

export type MemberProfileData = {
  role: OrgRole;
  volunteerRoles: VolunteerRole[];
  createdAt: Date;
  organization: {
    name: string;
  };
  user: {
    firstName: string;
    lastName: string;
    userImageUrl: string | null;
  };
};

export type RangeKey = "all" | "year";
export type RangeStats = { invited: number; accepted: number; declined: number };
export type MemberSong = { title: string; artist: string; count: number };


const RING_CIRCUMFERENCE = 2 * Math.PI * 52; 


function useCountUp(target: number) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(count, target, { duration: 0.9, ease: [0.33, 1, 0.68, 1] });
    return () => controls.stop();
  }, [count, target]);

  return rounded;
};

export default function MemberProfile({
  membership,
  stats,
  songs,
}: {
  membership: MemberProfileData;
  stats: Record<RangeKey, RangeStats>;
  songs: MemberSong[];
}) {
  const [range, setRange] = useState<RangeKey>("all");

  const active = stats[range];
  const pctTarget = active.invited
    ? Math.round((active.accepted / active.invited) * 100)
    : 0;
  const pct = useCountUp(pctTarget);
  const maxCount = Math.max(1, ...songs.map((s) => s.count));

  const inviteWord = active.invited === 1 ? "invite" : "invites";
  const caption =
    active.invited === 0
      ? `No invites ${range === "year" ? "this year" : "yet"}`
      : `${range === "year" ? new Date().getFullYear() : "All time"} · ${active.invited} ${inviteWord}`;

  const fullName = `${membership.user.firstName} ${membership.user.lastName}`;
  const nameInitial = `${membership.user.firstName.charAt(0)}${membership.user.lastName.charAt(0)}`;
  const organizationName = membership.organization.name;
  const userImageUrl = membership.user.userImageUrl ?? undefined;
  const memberRole = getRoleConfig(membership.role);
  const RoleIcon = memberRole.icon;
  const volunteerRoles = membership.volunteerRoles;
  const joinedDate = new Date(membership.createdAt).toLocaleDateString(
    'en-US',
    { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }
  );

  

  return (
    <div className="min-h-screen bg-white text-[#1A1915] bg-[radial-gradient(1100px_480px_at_50%_-8%,rgba(255,255,255,0.9),rgba(255,255,255,0)_62%)]">
      <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3.5 border-b border-[#E7E4DB] bg-[#FFFFFFD9] px-[clamp(20px,5vw,56px)] py-3.5 backdrop-blur-[10px]">
        <div className="flex items-center gap-2.5">
          <span className="block size-2.5 rounded-full bg-primary" />
          <span className="text-base font-bold tracking-[-0.01em]">
            {organizationName}
          </span>
        </div>
        <nav className="flex items-center gap-2 text-sm text-[#6E6A5E]">
          <Link href="/members" className="transition-colors hover:text-[#1A1915]">
            Members
          </Link>
          <span className="text-[#C9C5B8]">/</span>
          <span className="font-medium text-[#1A1915]">{fullName}</span>
        </nav>
      </header>

      <main className="mx-auto max-w-285 px-[clamp(20px,5vw,56px)] pb-[clamp(56px,8vw,96px)] pt-[clamp(32px,5.5vw,64px)]">
        <m.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-wrap items-center gap-[clamp(24px,4vw,44px)]"
        >
          <div className="aspect-square w-[clamp(110px,15vw,152px)] flex-none rounded-full border border-[#E7E4DB] bg-white p-1.75 shadow-[0_12px_32px_rgba(26,25,21,0.09)]">
            <Avatar className="size-full">
              <AvatarImage src={userImageUrl} alt={fullName} />
              <AvatarFallback className="bg-[#EFEDE4] text-2xl font-bold text-[#8A8677]">
                {nameInitial}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="min-w-[min(100%,320px)] flex-1">
            <h1 className="mb-3 mt-2 text-[clamp(2.5rem,6vw,4.1rem)] font-bold leading-[1.02] tracking-[-0.035em]">
              {fullName}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <Badge className={`gap-2 rounded-full border px-4 py-2 ${memberRole.className}`}>
                <span className="flex items-center gap-1.5 text-sm font-semibold">
                  <RoleIcon className="h-3.5 w-3.5" />
                  {memberRole.label}
                </span>
              </Badge>
              {volunteerRoles.map((role) => {
                const config = volunteerRoleConfig[role];
                return (
                  <Badge
                    key={role}
                    className="gap-1 rounded-full border border-[#E7E4DB] bg-white px-4 py-2 text-sm font-semibold text-[#1A1915] hover:bg-white"
                  >
                    <span aria-hidden>{config.icon}</span>
                    {config.label}
                  </Badge>
                );
              })}
              <span className="px-1 py-2 text-sm text-[#8A8677]">
                Member since {joinedDate}
              </span>
            </div>
          </div>
        </m.section>
        <div className="mt-[clamp(36px,5vw,56px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,350px),1fr))] items-stretch gap-[clamp(16px,2.5vw,24px)]">
          <m.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col rounded-[24px] border border-[#E7E4DB] bg-white p-[clamp(22px,3vw,32px)] shadow-[0_1px_2px_rgba(26,25,21,0.04)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6E6A5E]">
                Event acceptance
              </h2>
              <Tabs value={range} onValueChange={(v) => setRange(v as RangeKey)}>
                <TabsList className="h-auto rounded-full bg-[#EFEDE4] p-0.75">
                  <TabsTrigger
                    value="all"
                    className="rounded-full px-3.5 py-1.5 text-[13px] font-semibold text-[#6E6A5E] data-[state=active]:bg-white data-[state=active]:text-[#1A1915] data-[state=active]:shadow-[0_1px_3px_rgba(26,25,21,0.14)]"
                  >
                    All time
                  </TabsTrigger>
                  <TabsTrigger
                    value="year"
                    className="rounded-full px-3.5 py-1.5 text-[13px] font-semibold text-[#6E6A5E] data-[state=active]:bg-white data-[state=active]:text-[#1A1915] data-[state=active]:shadow-[0_1px_3px_rgba(26,25,21,0.14)]"
                  >
                    This year
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="mt-6 flex flex-1 items-center justify-center">
              <div className="relative aspect-square w-[min(190px,52vw)]">
                <svg viewBox="0 0 120 120" className="block size-full">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#EFEDE4" strokeWidth="9" />
                  <m.circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray={RING_CIRCUMFERENCE}
                    initial={{ strokeDashoffset: RING_CIRCUMFERENCE }}
                    animate={{ strokeDashoffset: RING_CIRCUMFERENCE * (1 - pctTarget / 100) }}
                    transition={{ duration: 1, ease: [0.22, 0.8, 0.24, 1] }}
                    transform="rotate(-90 60 60)"
                    className="stroke-primary"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
                  <div className="text-[clamp(34px,9vw,44px)] font-bold leading-none tracking-[-0.03em]">
                    <m.span>{pct}</m.span>
                    <span className="text-[0.5em] font-semibold text-[#6E6A5E]">%</span>
                  </div>
                  <div className="text-xs tracking-[0.04em] text-[#6E6A5E]">accepted</div>
                </div>
              </div>
            </div>

            <div className="mt-5.5 grid grid-cols-3 gap-3 border-t border-[#F0EEE6] pt-5">
              {(
                [
                  { label: "Invited", value: active.invited, dot: "#1A1915" },
                  { label: "Accepted", value: active.accepted, dot: "var(--primary)" },
                  { label: "Declined", value: active.declined, dot: "#D8D3C4" },
                ] as const
              ).map((s) => (
                <div key={s.label} className="flex flex-col gap-1">
                  <span className="flex items-center gap-1.5 text-xs text-[#6E6A5E]">
                    <span
                      className="block size-1.75 rounded-full"
                      style={{ backgroundColor: s.dot }}
                    />
                    {s.label}
                  </span>
                  <span className="text-[22px] font-bold">{s.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-3.5 text-[12.5px] text-[#8A8677]">{caption}</div>
          </m.section>

          {/* ----------------------- Top 5 songs */}
          <m.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col rounded-[24px] border border-[#E7E4DB] bg-white p-[clamp(22px,3vw,32px)] shadow-[0_1px_2px_rgba(26,25,21,0.04)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6E6A5E]">
                Top 5 songs
              </h2>
              <span className="text-[13px] text-[#8A8677]">All time</span>
            </div>

            <div className="mt-2.5 flex flex-col">
              {songs.length === 0 ? (
                <p className="py-8 text-center text-[13.5px] text-[#8A8677]">
                  No songs performed yet.
                </p>
              ) : (
                songs.map((song, i) => (
                  <div key={`${song.title}-${song.artist}`} className="py-3.25">
                    <div className="grid grid-cols-[30px_1fr_auto] items-center gap-3.5">
                      <span className="text-[15px] font-bold text-[#C9C5B8]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <div className="truncate text-[15.5px] font-semibold tracking-[-0.005em]">
                          {song.title}
                        </div>
                        <div className="mt-0.5 text-[13.5px] text-[#6E6A5E]">{song.artist}</div>
                      </div>
                      <div className="text-[19px] font-bold tracking-[-0.01em]">
                        {song.count}
                        <span className="text-xs font-medium text-[#8A8677]">×</span>
                      </div>
                    </div>

                    {/* Play-count bar */}
                    <div className="ml-11 mt-2.5 h-1.25 overflow-hidden rounded-full bg-[#F0EEE6]">
                      <m.div
                        className="h-full rounded-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${(song.count / maxCount) * 100}%` }}
                        transition={{ duration: 0.9, ease: [0.22, 0.8, 0.24, 1] }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </m.section>
        </div>
      </main>
    </div>
  );
}
