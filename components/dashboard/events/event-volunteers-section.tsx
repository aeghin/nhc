import { Users, CheckCircle2, Clock, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
// import { VolunteerRowMenu } from "./volunteer-row-menu"
// import { getRoleInfo } from "./utils"
// import type { Event } from "@/lib/types"

interface EventVolunteersSectionProps {
  event: Event
  userId: string
  userRoles: string[]
  canManage: boolean
}

// TODO: real shape comes from EventAssignment with status PENDING/ACCEPTED/DECLINED
type AssignmentStatus = "ACCEPTED" | "PENDING" | "DECLINED"
interface AssignmentLike {
  userId: string
  userName: string
  role: string
  status: AssignmentStatus
}

export function EventVolunteersSection({
  event,
  userId,
  userRoles,
  canManage,
}: EventVolunteersSectionProps) {
  // TODO: replace this derivation with event.assignments from EventAssignment
  // For now, treat acceptedVolunteers as ACCEPTED rows and rolesNeeded gaps as PENDING placeholders.
  // const assignments: AssignmentLike[] = event.rolesNeeded.map(
  //   (roleId, idx) => {
  //     const accepted = event.acceptedVolunteers[idx]
  //     return accepted
  //       ? {
  //           userId: accepted.userId,
  //           userName: accepted.userName,
  //           role: roleId,
  //           status: "ACCEPTED" as const,
  //         }
  //       : {
  //           userId: "",
  //           userName: "Awaiting response",
  //           role: roleId,
  //           status: "PENDING" as const,
  //         }
  //   },
  // )

  // const acceptedCount = assignments.filter((a) => a.status === "ACCEPTED").length
  // const totalSlots = assignments.length
  // const fillPercent =
  //   totalSlots > 0 ? Math.round((acceptedCount / totalSlots) * 100) : 0

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <Users className="h-4 w-4 text-muted-foreground" />
            Volunteers
          </CardTitle>
          {/* <span className="text-xs text-muted-foreground">
            {acceptedCount}/{totalSlots} confirmed
          </span> */}
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/50 mt-2">
          {/* <div
            className={cn(
              "h-full rounded-full transition-all",
              fillPercent === 100
                ? "bg-emerald-500"
                : fillPercent > 50
                  ? "bg-primary"
                  : "bg-amber-500",
            )}
            style={{ width: `${fillPercent}%` }}
          /> */}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* {assignments.map((assignment, idx) => {
          const role = getRoleInfo(assignment.role)
          const isAccepted = assignment.status === "ACCEPTED"
          const isPending = assignment.status === "PENDING"
          const isDeclined = assignment.status === "DECLINED"

          return (
            <div
              key={`${assignment.role}-${idx}`}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors",
                isAccepted && "border-border/30 bg-muted/20",
                isPending && "border-amber-500/30 bg-amber-500/5",
                isDeclined && "border-border/30 bg-muted/10",
              )}
            >
              <span className="text-base">{role.icon}</span>
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-sm font-medium",
                    (isAccepted || isDeclined) && "text-muted-foreground",
                  )}
                >
                  {role.name}
                </p>
                {isAccepted && (
                  <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    {assignment.userName}
                  </p>
                )}
                {isPending && (
                  <p className="text-xs text-amber-600 font-medium truncate flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {assignment.userName}
                  </p>
                )}
                {isDeclined && (
                  <p className="text-xs text-muted-foreground truncate flex items-center gap-1 line-through">
                    <XCircle className="h-3 w-3 text-destructive" />
                    {assignment.userName}
                  </p>
                )}
              </div>
              {canManage && (
                <VolunteerRowMenu
                  eventId={event.id}
                  assignedUserId={assignment.userId}
                  roleId={assignment.role}
                  status={assignment.status}
                />
              )}
            </div> */}
          {/* )
        })} */}
      </CardContent>
    </Card>
  )
}