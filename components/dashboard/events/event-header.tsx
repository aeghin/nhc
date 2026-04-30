import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
// import { EditEventButton } from "./edit-event-button"
// import { getColorClasses, getRoleInfo, getDateParts } from "./utils"
// import type { Event, ServiceType } from "@/lib/types"
import { colorClasses } from "@/lib/config/service-types-config";
import { VolunteerRole, InvitationStatus } from "@/generated/prisma/enums";
import { volunteerRoleConfig } from "@/lib/config/roles";



type Event = {
  id: string
  name: string
  description: string
  createdAt: Date
  updatedAt: Date
  assignments: {
        userId: string;
        id: string;
        role: VolunteerRole;
        eventId: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        assignedById: string;
        status: InvitationStatus;
        expiresAt: Date;
  }[],
  dates: {
        id: string;
        eventId: string;
        startTime: Date;
        endTime: Date;
  }[],
  serviceType: any,
  organization: any
};

interface EventHeaderProps {
  event: Event
  userId: string
  serviceType: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    organizationId: string;
    color: string;
  }
}

export function EventHeader({
  event,
  userId,
  serviceType,
}: EventHeaderProps) {
  const serviceColors = colorClasses[serviceType.color];
  // const dateParts = getDateParts(event.date)

  const userAssignment = event.assignments.find((e) => e.userId === userId);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/40 border-l-[3px] bg-linear-to-br from-card via-card to-primary/5 p-8",
        serviceColors.border,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div
            className={
              "flex w-16 flex-col items-center justify-center rounded-xl border py-3 border-emerald-500/30 bg-emerald-500/5"
            }
          >
            <span
              className={
                "text-[10px] font-bold tracking-wider text-emerald-600"
              }
            >
              {/* {dateParts.month} */}
            </span>
            <span
              className={
                "text-2xl font-bold leading-none text-emerald-700"
                  }
            >
              {/* {dateParts.day} */}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {/* {dateParts.weekday} */}
            </span>
          </div>

          <div>
            {serviceType && (
              <Badge
                className={cn(
                  "mb-2 text-xs font-medium",
                  serviceColors.badge,
                  serviceColors.badgeText,
                )}
              >
                <span
                  className={cn(
                    "mr-1.5 h-2 w-2 rounded-full",
                    serviceColors.dot,
                  )}
                />
                {serviceType.name}
              </Badge>
            )}
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold sm:text-2xl text-balance">
                {event.name}
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              {event.description}
            </p>
              {userAssignment && (
                <Badge
                  className={
                    "mt-2 gap-1.5 font-medium border"
                  }
                >
                  <span>{volunteerRoleConfig[userAssignment.role].icon}</span>
                  {volunteerRoleConfig[userAssignment.role].label} - Assigned
                </Badge>
              )}
          </div>
        </div>

        {/* {canManage && <EditEventButton eventId={event.id} />} */}
      </div>
    </div>
  )
}