
import Link from "next/link";
import prisma from "@/lib/prisma";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Building2,
  XCircle,
  ArrowLeft,
  Clock,
} from "lucide-react";

import { volunteerRoleConfig } from "@/lib/config/roles";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { verifyInvitationByToken } from "@/lib/services/invitation";
import { InviteActions } from "@/components/invites/org-invite-buttons";
import { InvitationStatus } from "@/generated/prisma/enums";

const Header = () => (
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
);

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <main className="flex flex-1 items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">{children}</div>
    </main>
  </div>
);

const InvitePage = async ({
  params,
}: {
  params: Promise<{ token: string }>;
}) => {
  const { token } = await params;

  const invitation = await verifyInvitationByToken(token);

  if (!invitation) {
    return (
      <PageWrapper>
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
      </PageWrapper>
    );
  };

   if (invitation.status !== InvitationStatus.PENDING) {
    return (
      <PageWrapper>
        <Card className="border-2 overflow-hidden text-center">
          <CardContent className="p-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <XCircle className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight mb-2">
              Invitation Unavailable
            </h1>
            <p className="text-muted-foreground mb-6">
              This invitation has already been {invitation.status.toLowerCase()}.
            </p>
            <Link href="/">
              <Button variant="outline" className="cursor-pointer">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </PageWrapper>
    );
  };

  if (invitation.expiresAt < new Date()) {
    return (
      <PageWrapper>
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
      </PageWrapper>
    );
  };

  const { userId } = await auth();

  if (!userId) redirect(`/sign-up?redirect_url=/invite/${token}`);

  const organizationName = invitation.organization.name;
  const invitedBy = invitation.invitedBy.firstName;
  const roles = invitation.volunteerRoles;
  const email = invitation.email;

  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId
    }
  });

  if (!user) {
  return (
    <PageWrapper>
      <Card className="border-2 overflow-hidden text-center">
        <CardContent className="p-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Clock className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">
            Setting Up Your Account
          </h1>
          <p className="text-muted-foreground mb-6">
            Your account is still being set up. Please refresh the page or try
            again in a moment.
          </p>
          <Link href={`/invite/${token}`}>
            <Button variant="outline" className="cursor-pointer">
              Try Again
            </Button>
          </Link>
        </CardContent>
      </Card>
    </PageWrapper>
  );
};

  if (email !== user.email) {
  return (
    <PageWrapper>
      <Card className="border-2 overflow-hidden text-center">
        <CardContent className="p-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <Mail className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">
            Email Mismatch
          </h1>
          <p className="text-muted-foreground mb-2">
            This invitation was sent to
          </p>
          <p className="font-semibold text-foreground mb-4">
            {email}
          </p>
          <p className="text-muted-foreground mb-6">
            Please sign in with that email or ask the organization admin to
            resend the invitation to your current address.
          </p>
          <Link href={`/sign-in?redirect_url=/invite/${token}`}>
            <Button variant="outline" className="cursor-pointer">
              Sign In with Different Account
            </Button>
          </Link>
        </CardContent>
      </Card>
    </PageWrapper>
  );
};

  return (
    <PageWrapper>
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
              <p className="text-xs text-muted-foreground mb-0.5">
                Invited by
              </p>
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
          <InviteActions token={token} organizationName={organizationName} />
        </CardContent>
      </Card>
    </PageWrapper>
  );
};

export default InvitePage;
