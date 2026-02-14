import prisma from "@/lib/prisma";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Building2,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Clock,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

import { volunteerRoleConfig } from "@/lib/config/roles";

const InvitePage = async ({
  params,
}: {
  params: Promise<{ token: string }>;
}) => {
  const { token } = await params;

  const invitation = await prisma.invitation.findUnique({
    where: {
      token,
    },
    include: {
      organization: true,
      invitedBy: true,
    },
  });

  if (!invitation) return <h1>Invalid or expired invitation</h1>;

  const organizationName = invitation.organization.name;
  const invitedBy = invitation.invitedBy.firstName;
  const roles = invitation.volunteerRoles;
  const email = invitation.email;

  let status = "pending";

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-primary to-primary/70 shadow-lg shadow-primary/25 text-primary-foreground font-bold text-sm">
              N
            </div>
            <span className="text-lg font-semibold">NHW</span>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Pending / Accepting */}
          {(status === "pending" || status === "accepting") && (
            <Card className="border-2 overflow-hidden">
              <CardHeader className="bg-linear-to-br from-primary/5 to-primary/10 pb-8 pt-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Mail className="h-8 w-8" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">
                  {"You're Invited"}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {"You've been invited to join an organization"}
                </p>
              </CardHeader>

              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-xl border border-border/60 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Organization
                      </p>
                      <p className="font-semibold">{organizationName}</p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border/60 p-3">
                    <p className="text-xs text-muted-foreground mb-0.5">
                      Invited by
                    </p>
                    <p className="text-sm font-medium">{invitedBy}</p>
                  </div>

                  <div className="rounded-xl border border-border/60 p-3">
                    <p className="text-xs text-muted-foreground mb-1.5">
                      Roles
                    </p>
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
                    <p className="text-xs text-muted-foreground mb-0.5">
                      Sent to
                    </p>
                    <p className="text-sm font-medium">{email}</p>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex gap-3 p-6 pt-0">
                <Button
                  variant="outline"
                  className="flex-1 cursor-pointer"
                  disabled={status === "accepting"}
                >
                  Decline
                </Button>
                <Button
                  className="flex-1 cursor-pointer shadow-lg shadow-primary/25"
                  disabled={status === "accepting"}
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
              </CardFooter>
            </Card>
          )}

          {/* Accepted */}
          {status === "accepted" && (
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
          )}

          {/* Declined */}
          {status === "declined" && (
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
          )}

          {/* Expired */}
          {status === "expired" && (
            <Card className="border-2 overflow-hidden text-center">
              <CardContent className="p-8">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Clock className="h-8 w-8" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight mb-2">
                  Invitation Expired
                </h1>
                <p className="text-muted-foreground mb-6">
                  This invitation is no longer valid. Please ask the
                  organization admin to send a new one.
                </p>
                <Link href="/">
                  <Button variant="outline" className="cursor-pointer">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Invalid */}
          {status === "invalid" && (
            <Card className="border-2 overflow-hidden text-center">
              <CardContent className="p-8">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  <XCircle className="h-8 w-8" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight mb-2">
                  Invalid Invitation
                </h1>
                <p className="text-muted-foreground mb-6">
                  This invitation link is not valid. Please check the link and
                  try again.
                </p>
                <Link href="/">
                  <Button variant="outline" className="cursor-pointer">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default InvitePage;
