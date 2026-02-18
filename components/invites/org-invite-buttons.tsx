"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

import { acceptOrgInvite, declineOrgInvite } from "@/lib/actions/invitation";

interface InviteActionsProps {
  token: string;
  organizationName: string;
}

type InviteStatus = "idle" | "accepting" | "declining" | "accepted" | "declined";

export const InviteActions = ({ token, organizationName }: InviteActionsProps) => {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<InviteStatus>("idle");
  const [orgId, setOrgId] = useState<string>();

  const handleAccept = async () => {
    setStatus("accepting");
    startTransition(async () => {
      const result = await acceptOrgInvite(token);

      if (result.success) {
        setStatus("accepted");
        setOrgId(result.orgId ?? undefined);
      } else {
        setStatus("idle");
        toast.error(result.error);
      }
    });
  };

  const handleDecline = async () => {
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
  return (
    <div className="p-8 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight mb-2">
        Welcome Aboard
      </h1>
      <p className="text-muted-foreground mb-6">
        {"You've successfully joined "}
        <span className="font-semibold text-foreground">
          {organizationName}
        </span>
        .
      </p>
      <Link href={`/dashboard/organizations/${orgId}`}>
        <Button className="cursor-pointer shadow-lg shadow-primary/25">
          Go to Dashboard
        </Button>
      </Link>
    </div>
  );
}

if (status === "declined") {
  return (
    <div className="p-8 text-center">
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
    </div>
  );
}

  return (
    <>
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
    </>
  );
};