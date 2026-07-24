import type { ReactNode } from "react";
import {
  CalendarPlus,
  CalendarX,
  Mail,
  MailX,
  UserCheck,
  UserCog,
  UserMinus,
  UserX,
  XCircle,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { AnimatedInvitationRow } from "@/components/dashboard/animated-invitation-row";
import { cn } from "@/lib/utils";
import { ActivityType } from "@/generated/prisma/enums";
import type { ActivityItem } from "@/lib/services/activity";

const activityConfig: Record<ActivityType, { icon: LucideIcon; className: string }> = {
  EVENT_CREATED: { icon: CalendarPlus, className: "bg-emerald-500/10 text-emerald-600" },
  EVENT_DELETED: { icon: CalendarX, className: "bg-destructive/10 text-destructive" },
  INVITE_SENT: { icon: Mail, className: "bg-sky-500/10 text-sky-600" },
  INVITE_ACCEPTED: { icon: UserCheck, className: "bg-emerald-500/10 text-emerald-600" },
  INVITE_DECLINED: { icon: XCircle, className: "bg-destructive/10 text-destructive" },
  INVITE_CANCELED: { icon: MailX, className: "bg-muted text-muted-foreground" },
  AUTO_INVITE_SENT: { icon: Zap, className: "bg-amber-500/10 text-amber-600" },
  MEMBER_REMOVED: { icon: UserX, className: "bg-destructive/10 text-destructive" },
  MEMBER_LEFT: { icon: UserMinus, className: "bg-muted text-muted-foreground" },
  ROLE_CHANGED: { icon: UserCog, className: "bg-violet-500/10 text-violet-600" },
};

const Name = ({ children }: { children: ReactNode }) => (
  <span className="font-medium text-foreground">{children}</span>
);

const describeActivity = (item: ActivityItem): ReactNode => {
  switch (item.type) {
    case ActivityType.EVENT_CREATED:
      return (
        <>
          <Name>{item.actorName}</Name> created the event <Name>{item.targetName}</Name>
        </>
      );
    case ActivityType.EVENT_DELETED:
      return (
        <>
          <Name>{item.actorName}</Name> deleted the event <Name>{item.targetName}</Name>
        </>
      );
    case ActivityType.INVITE_SENT:
      return (
        <>
          <Name>{item.actorName}</Name> invited <Name>{item.targetName}</Name> to the
          organization
        </>
      );
    case ActivityType.INVITE_ACCEPTED:
      return (
        <>
          <Name>{item.actorName}</Name> accepted their invitation and joined
        </>
      );
    case ActivityType.INVITE_DECLINED:
      return (
        <>
          <Name>{item.actorName}</Name> declined their invitation
        </>
      );
    case ActivityType.INVITE_CANCELED:
      return (
        <>
          <Name>{item.actorName}</Name> canceled the invitation to{" "}
          <Name>{item.targetName}</Name>
        </>
      );
    case ActivityType.AUTO_INVITE_SENT:
      return (
        <>
          Smart Scheduling auto-invited <Name>{item.targetName}</Name>
        </>
      );
    case ActivityType.MEMBER_REMOVED:
      return (
        <>
          <Name>{item.actorName}</Name> removed <Name>{item.targetName}</Name> from the
          organization
        </>
      );
    case ActivityType.MEMBER_LEFT:
      return (
        <>
          <Name>{item.actorName}</Name> left the organization
        </>
      );
    case ActivityType.ROLE_CHANGED:
      return item.actorName ? (
        <>
          <Name>{item.actorName}</Name> changed <Name>{item.targetName}</Name>&apos;s role
          to <Name>{item.detail}</Name>
        </>
      ) : (
        <>
          <Name>{item.targetName}</Name> was automatically promoted to{" "}
          <Name>{item.detail}</Name>
        </>
      );
  }
};

// Recent entries read best as relative ("3 hours ago"); older ones are clearer
// as an absolute date. The exact timestamp is always available on hover.
const formatActivityTime = (date: Date) => {
  const diffDays = (Date.now() - date.getTime()) / 86_400_000;
  return diffDays < 7
    ? formatDistanceToNow(date, { addSuffix: true })
    : format(date, "MMM d, yyyy");
};

interface ActivityRowProps {
  item: ActivityItem;
  index: number;
}

export const ActivityRow = ({ item, index }: ActivityRowProps) => {
  const config = activityConfig[item.type];
  const Icon = config.icon;

  // ROLE_CHANGED works its detail into the sentence itself.
  const supplementalDetail =
    item.type === ActivityType.ROLE_CHANGED ? null : item.detail;

  return (
    <AnimatedInvitationRow index={index}>
      <div className="flex min-w-0 items-start gap-4">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
            config.className
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 space-y-1">
          <p className="text-sm text-muted-foreground">{describeActivity(item)}</p>
          <p
            className="text-xs text-muted-foreground"
            title={format(item.createdAt, "PPpp")}
          >
            {formatActivityTime(item.createdAt)}
            {supplementalDetail && ` · ${supplementalDetail}`}
          </p>
        </div>
      </div>
    </AnimatedInvitationRow>
  );
};
