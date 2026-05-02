import { Calendar, Clock, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";


type Event = {
  id: string
  name: string
  description: string
  createdAt: Date
  updatedAt: Date
  dates: {
        id: string;
        eventId: string;
        startTime: Date;
        endTime: Date;
  }[],
};

interface EventDetailsCardProps {
  event: Event
};

export function EventDetailsCard({ event }: EventDetailsCardProps) {

  console.log(event.dates);
  const start = event.dates[0].startTime;
  
  // const end = event.dateEnd && event.dateEnd !== event.date ? getDateParts(event.dateEnd) : null

  // const rows = [
  //   {
  //     icon: Calendar,
  //     label: "Date",
  //     value: start.full,
  //     sub: end ? `through ${end.full}` : undefined,
  //   },
  //   {
  //     icon: Clock,
  //     label: "Time",
  //     value: event.time,
  //   },
  //   {
  //     icon: MapPin,
  //     label: "Where",
  //     value: event.location,
  //   },
  // ]

  return (
    <Card className="overflow-hidden p-0">
      <ul className="divide-y divide-border/60">
        {/* {rows.map(({ icon: Icon, label, value, sub }) => (
          <li
            key={label}
            className="flex items-center gap-3 px-4 py-3"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {label}
              </p>
              <p className="truncate text-sm font-medium text-foreground">{value}</p>
              {sub && (
                <p className="truncate text-xs text-muted-foreground">{sub}</p>
              )}
            </div>
          </li>
        ))} */}
      </ul>
    </Card>
  )
}
