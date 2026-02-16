"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

type InviteStatus = "idle" | "accepting" | "declining" | "accepted" | "declined";

interface InviteActionsProps {
  token: string;
  organizationName: string;
}

export const InviteActions = ({ token, organizationName }: InviteActionsProps) => {

    const [status, setStatus] = useState<InviteStatus>();

  const handleAccept = async () => {
    setStatus("accepted");
  };

  const handleDecline = async () => {
    setStatus('declined');
  };

  if (status === "accepted") {
    return (
      <Card className="border-2 overflow-hidden text-center">
        <CardContent className="p-8">
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
          <Link href="/dashboard">
            <Button className="cursor-pointer shadow-lg shadow-primary/25">
              Go to Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
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
    <>
      <Button
        variant="outline"
        className="flex-1 cursor-pointer"
        onClick={handleDecline}
        // disabled={status === "accepting" || status === "declining"}
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
        // disabled={status === "accepting" || status === "declining"}
      >
        {status === "accepting" ? (
          <>
            <Spinner data-icon="inline-start" />
            Accepting...
          </>
        ) : (
          "Accept Invitation"
        )}
      </Button>
    </>
  );
};