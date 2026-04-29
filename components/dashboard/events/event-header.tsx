import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
// import { EditEventButton } from "./edit-event-button"
// import { getColorClasses, getRoleInfo, getDateParts } from "./utils"
// import type { Event, ServiceType } from "@/lib/types"

interface EventHeaderProps {
  event: Event
  orgId: string
  orgName: string
  userId: string
  canManage: boolean
  // serviceType?: ServiceType
}

export function EventHeader({
  event,
  orgId,
  orgName,
  userId,
  canManage,
  // serviceType,
}: EventHeaderProps) {
  // const serviceColors = getColorClasses(serviceType?.color || "indigo")
  // const dateParts = getDateParts(event.date)

  // // TODO: replace with assignment lookup
  // // const userAssignment = event.assignments.find(
  // //   (a) => a.userId === userId && a.status === "ACCEPTED",
  // // )
  // const accepted = event.acceptedVolunteers.some((v) => v.userId === userId)
  // const userVolunteerInfo = event.acceptedVolunteers.find(
  //   (v) => v.userId === userId,
  // )
  // const filledCount = event.acceptedVolunteers.length
  // const totalSlots = event.rolesNeeded.length
  // const spotsLeft = Math.max(0, totalSlots - filledCount)

  return (
    <div
      // className={cn(
      //   "border-b bg-card border-l-[3px]",
      //   serviceColors.border,
      // )}
    >
      {/* <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <Link
          href={`/dashboard/organizations/${orgId}`}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {orgName}
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "flex w-16 flex-col items-center justify-center rounded-xl border py-3",
                accepted
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : spotsLeft > 0
                    ? "border-amber-500/30 bg-amber-500/5"
                    : "border-border/40 bg-muted/30",
              )}
            >
              <span
                className={cn(
                  "text-[10px] font-bold tracking-wider",
                  accepted
                    ? "text-emerald-600"
                    : spotsLeft > 0
                      ? "text-amber-600"
                      : "text-muted-foreground",
                )}
              >
                {dateParts.month}
              </span>
              <span
                className={cn(
                  "text-2xl font-bold leading-none",
                  accepted
                    ? "text-emerald-700"
                    : spotsLeft > 0
                      ? "text-amber-700"
                      : "text-foreground",
                )}
              >
                {dateParts.day}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {dateParts.weekday}
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
                {accepted && (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  </div>
                )}
                {!accepted && spotsLeft > 0 && (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/15">
                    <div className="h-2 w-2 rounded-full bg-amber-500" />
                  </div>
                )}
                <h1 className="text-xl font-bold sm:text-2xl text-balance">
                  {event.name}
                </h1>
              </div>
              <p className="text-sm text-muted-foreground">
                {event.description}
              </p>

              {accepted && userVolunteerInfo && (
                <Badge
                  className={cn(
                    "mt-2 gap-1.5 font-medium border",
                    getRoleInfo(userVolunteerInfo.role).color,
                  )}
                >
                  <span>{getRoleInfo(userVolunteerInfo.role).icon}</span>
                  {getRoleInfo(userVolunteerInfo.role).name} - Assigned
                </Badge>
              )}
            </div>
          </div>

          {canManage && <EditEventButton eventId={event.id} />} */}
        {/* </div> */}
      {/* </div> */}
    </div>
  )
}