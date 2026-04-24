import {
  Mail,
  CheckCircle2,
  Clock,
  XCircle,
  MoreHorizontal,
  RefreshCw,
  Send,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AnimatedInvitationRow } from "@/components/dashboard/animated-invitation-row";
import { cn } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { InvitationStatus } from "@/generated/prisma/enums";

// TODO: Replace with real service function
// import { getInvitationsByOrganization } from "@/lib/services/invitation";

// TODO: Move to lib/config/invitation.ts
const getStatusConfig = (status: InvitationStatus) => {
  switch (status) {
    case InvitationStatus.ACCEPTED:
      return {
        icon: CheckCircle2,
        label: "Accepted",
        className:
          "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      };
    case InvitationStatus.DECLINED:
      return {
        icon: XCircle,
        label: "Declined",
        className:
          "bg-destructive/10 text-destructive border-destructive/20",
      };
    case InvitationStatus.CANCELED:
      return {
        icon: Clock,
        label: "Canceled",
        className: "bg-muted text-muted-foreground border-border",
      };
    default:
      return {
        icon: Clock,
        label: InvitationStatus.PENDING,
        className:
          "bg-amber-500/10 text-amber-600 border-amber-500/20",
      };
  }
};

interface InvitationsTabContentProps {
  organizationId: string;
  organizationName: string;
  canManage: boolean;
}

export const InvitationsTabContent = async ({
  organizationId,
  organizationName,
  canManage,
}: InvitationsTabContentProps) => {
  

  const invitations = await prisma.invitation.findMany({
    where: {
      organizationId
    }
  })

  const pendingCount = invitations.filter(
    (inv) => inv.status === InvitationStatus.PENDING
  ).length;


  return (
    <Card className="overflow-hidden rounded-xl border-border/40 bg-linear-to-br from-card to-card/80 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 bg-secondary/20 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">
              Invitations
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {pendingCount} pending
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {invitations.length === 0 ? (
          <div className="flex h-50 flex-col items-center justify-center gap-2 text-muted-foreground">
            <Mail className="h-10 w-10 opacity-20" />
            <p className="text-sm">No invitations found</p>
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {invitations.map((invitation, i) => {
              const statusConfig = getStatusConfig(invitation.status);
              const StatusIcon = statusConfig.icon;

              return (
                <AnimatedInvitationRow key={invitation.id} index={i}>
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-secondary to-secondary/50 text-sm font-semibold text-secondary-foreground">
                      {invitation.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {invitation.email}
                        </span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] font-medium capitalize",
                            statusConfig.className
                          )}
                        >
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {statusConfig.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Invited{" "}
                        {new Date(invitation.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      <span>{`${statusConfig.label} on `}</span>
                      {new Date(invitation.updatedAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 cursor-pointer opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        {invitation.status === "PENDING" && (
                          <>
                            <DropdownMenuItem className="cursor-pointer">
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Resend Invitation
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                          </>
                        )}
                        {invitation.status === "CANCELED" && (
                          <>
                            <DropdownMenuItem className="cursor-pointer">
                              <Send className="mr-2 h-4 w-4" />
                              Send New Invitation
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                          </>
                        )}
                        <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </AnimatedInvitationRow>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};