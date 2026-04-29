import { Calendar, Clock, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { EditDetailsButton } from "./edit-details-button"
// import { getDateParts } from "./utils"
// import type { Event } from "@/lib/types"

interface EventDetailsCardProps {
  event: Event
  canManage: boolean
}

export function EventDetailsCard({ event, canManage }: EventDetailsCardProps) {
  // const dateParts = getDateParts(event.date)

  return (
    <Card>
      {/* <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">Details</CardTitle>
          {canManage && <EditDetailsButton eventId={event.id} />}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{dateParts.full}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{event.time}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{event.location}</span>
        </div>
      </CardContent> */}
    </Card>
  )
}