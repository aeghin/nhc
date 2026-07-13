"use client";

import { useTransition } from "react";
import Link from "next/link";
import { m } from "motion/react";
import { Inbox, Hourglass, Check, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { getServiceColorClasses } from "@/lib/config/service-colors";
import {
  acceptEventInvitation,
  declineEventInvitation,
} from "@/lib/actions/event";

export interface PendingInvite {
  eventId: string;
  eventName: string;
  whenLabel: string;
  roleLabel: string | null;
  serviceColor: string;
  expiryLabel: string;
  expiryUrgent: boolean;
}

interface NeedsResponseBannerProps {
  invites: PendingInvite[];
  organizationId: string;
}

export function NeedsResponseBanner({
  invites,
  organizationId,
}: NeedsResponseBannerProps) {
  return (
    <m.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden rounded-xl border border-amber-500/20 bg-linear-to-br from-amber-500/5 to-card"
    >
      <div className="flex items-center gap-2.5 border-b border-border/40 px-4 py-3">
        <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10">
          <Inbox className="h-4 w-4 text-amber-600" />
        </div>
        <p className="text-sm font-semibold">Needs your response</p>
        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500/10 px-1.5 text-xs font-medium text-amber-600">
          {invites.length}
        </span>
      </div>

      <div className="divide-y divide-border/40">
        {invites.map((invite) => (
          <InviteRow
            key={invite.eventId}
            invite={invite}
            organizationId={organizationId}
          />
        ))}
      </div>
    </m.div>
  );
}

function InviteRow({
  invite,
  organizationId,
}: {
  invite: PendingInvite;
  organizationId: string;
}) {
  const [isAccepting, startAccept] = useTransition();
  const [isDeclining, startDecline] = useTransition();

  const colors = getServiceColorClasses(invite.serviceColor);
  const isBusy = isAccepting || isDeclining;

  function handleAccept() {
    startAccept(async () => {
      const result = await acceptEventInvitation(
        organizationId,
        invite.eventId,
      );
      result.success
        ? toast.success("Event Successfully Accepted", {
            position: "bottom-center",
          })
        : toast.error(`${result.error}`, { position: "bottom-center" });
    });
  }

  function handleDecline() {
    startDecline(async () => {
      const result = await declineEventInvitation(
        organizationId,
        invite.eventId,
      );
      result.success
        ? toast.success("Event Declined", { position: "bottom-center" })
        : toast.error(`${result.error}`, { position: "bottom-center" });
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3">
      <span className={cn("size-2 shrink-0 rounded-full", colors.dot)} />

      <div className="min-w-0 flex-1 basis-52">
        <Link
          href={`/dashboard/organizations/${organizationId}/events/${invite.eventId}`}
          className="hover:underline"
        >
          <p className="truncate text-sm font-medium">{invite.eventName}</p>
        </Link>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
          {invite.roleLabel && <span>{invite.roleLabel}</span>}
          <span>· {invite.whenLabel}</span>
          <span
            className={cn(
              "flex items-center gap-1 font-medium",
              invite.expiryUrgent ? "text-red-600" : "text-amber-600",
            )}
          >
            <Hourglass className="h-3 w-3" />
            {invite.expiryLabel}
          </span>
        </p>
      </div>

      <div className="flex w-full gap-2 sm:w-auto">
        <Button
          size="sm"
          className="h-9 flex-1 cursor-pointer bg-emerald-600 text-white hover:bg-emerald-700 sm:h-8 sm:flex-none"
          onClick={handleAccept}
          disabled={isBusy}
        >
          {isAccepting ? (
            <Spinner />
          ) : (
            <>
              <Check className="mr-1 h-3.5 w-3.5" />
              Accept
            </>
          )}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-9 flex-1 cursor-pointer border-destructive text-destructive hover:bg-destructive/10 sm:h-8 sm:flex-none"
          onClick={handleDecline}
          disabled={isBusy}
        >
          {isDeclining ? (
            <Spinner />
          ) : (
            <>
              <X className="mr-1 h-3.5 w-3.5" />
              Decline
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
