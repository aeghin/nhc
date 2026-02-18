"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Building2, XCircle, ArrowLeft } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

import { acceptOrgInvite, declineOrgInvite } from "@/lib/actions/invitation";
import { volunteerRoleConfig } from "@/lib/config/roles";
import { VolunteerRole } from "@/generated/prisma/enums";
import { AcceptedCountdown } from "@/components/invites/accept-countdown";

interface InviteActionsProps {
  token: string;
  organizationName: string;
  invitedBy: string;
  roles: VolunteerRole[];
  email: string;
}

type InviteStatus = "idle" | "accepting" | "declining" | "accepted" | "declined";

export const InviteActions = ({
  token,
  organizationName,
  invitedBy,
  roles,
  email,
}: InviteActionsProps) => {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<InviteStatus>("idle");
  const [orgId, setOrgId] = useState<string>();

  const handleAccept = () => {
    setStatus("accepting");
    startTransition(async () => {
      const result = await acceptOrgInvite(token);

      if (result.success) {
        setOrgId(result.orgId ?? undefined);
        setStatus("accepted");
      } else {
        setStatus("idle");
        toast.error(result.error);
      }
    });
  };

  const handleDecline = () => {
    setStatus("declining");
    startTransition(async () => {
      const result = await declineOrgInvite(token);

      if (result.success) {
        setStatus("declined");
      } else {
        setStatus("idle");
        toast.error(result.error);
      }
    });
  };

  if (status === "accepted") {
    return <AcceptedCountdown orgId={orgId} organizationName={organizationName} />;
  }

  if (status === "declined") {
    return (
      <Card className="border-2 overflow-hidden text-center">
        <CardContent className="p-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <XCircle className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">
            Invitation Declined
          </h1>
          <p className="text-muted-foreground mb-6">
            {"You've declined the invitation to join "}
            <span className="font-semibold text-foreground">
              {organizationName}
            </span>
            .
          </p>
          <Link href="/">
            <Button variant="outline" className="cursor-pointer">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 overflow-hidden">
      <CardContent className="bg-linear-to-br from-primary/5 to-primary/10 pb-8 pt-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Mail className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          {"You're Invited"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {"You've been invited to join an organization"}
        </p>
      </CardContent>

      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl border border-border/60 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Organization</p>
              <p className="font-semibold">{organizationName}</p>
            </div>
          </div>

          <div className="rounded-xl border border-border/60 p-3">
            <p className="text-xs text-muted-foreground mb-0.5">Invited by</p>
            <p className="text-sm font-medium">{invitedBy}</p>
          </div>

          <div className="rounded-xl border border-border/60 p-3">
            <p className="text-xs text-muted-foreground mb-1.5">Roles</p>
            <div className="flex flex-wrap gap-1.5">
              {roles.map((role) => {
                const { label, icon } = volunteerRoleConfig[role];
                return (
                  <span
                    key={role}
                    className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                  >
                    {icon} {label}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-border/60 p-3">
            <p className="text-xs text-muted-foreground mb-0.5">Sent to</p>
            <p className="text-sm font-medium">{email}</p>
          </div>
        </div>
      </CardContent>

      <CardContent className="flex gap-3 p-6 pt-0">
        <Button
          variant="outline"
          className="flex-1 cursor-pointer"
          onClick={handleDecline}
          disabled={isPending}
        >
          {status === "declining" ? (
            <>
              <Spinner data-icon="inline-start" />
              Declining...
            </>
          ) : (
            "Decline"
          )}
        </Button>
        <Button
          className="flex-1 cursor-pointer shadow-lg shadow-primary/25"
          onClick={handleAccept}
          disabled={isPending}
        >
          {status === "accepting" ? (
            <>
              <Spinner data-icon="inline-start" />
              Accepting...
            </>
          ) : (
            "Accept"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};