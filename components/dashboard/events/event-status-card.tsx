import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
// import type { Event } from "@/lib/types"

interface EventStatusCardProps {
  event: Event
}

export function EventStatusCard({ event }: EventStatusCardProps) {
  // const filledCount = event.acceptedVolunteers.length
  // const totalSlots = event.rolesNeeded.length
  // const spotsLeft = Math.max(0, totalSlots - filledCount)

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-3">
          {/* <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Status</span> */}
            {/* <Badge
              variant="outline"
              className={cn(
                event.status === "upcoming" &&
                  "border-primary/30 text-primary bg-primary/5",
                event.status === "completed" &&
                  "border-emerald-500/30 text-emerald-600 bg-emerald-500/5",
                event.status === "cancelled" &&
                  "border-destructive/30 text-destructive bg-destructive/5",
              )}
            >
              {event.status}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Spots remaining</span>
            <span
              className={cn(
                "font-medium",
                spotsLeft === 0 ? "text-emerald-600" : "text-amber-600",
              )}
            >
              {spotsLeft === 0 ? "Fully staffed" : `${spotsLeft} open`}
            </span>
          </div>
          {event.setlist && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Songs</span>
              <span className="font-medium">{event.setlist.songs.length}</span>
            </div>
          )} */}
        </div>
      </CardContent>
    </Card>
  )
}