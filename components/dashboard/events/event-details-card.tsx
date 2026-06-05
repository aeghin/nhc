import { Calendar, Clock, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { colorClasses } from "@/lib/config/service-types-config";


type Event = {
  id: string
  name: string
  description: string
  location: string
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
  serviceType: {
    color: string
  }
};

export function EventDetailsCard({ event, serviceType }: EventDetailsCardProps) {
  const serviceColors = colorClasses[serviceType.color];

  const start = event.dates[0].startTime;
  const end = event.dates[0].endTime;

  const rows = [
    {
      icon: Calendar,
      label: "Date",
      value: start.toLocaleDateString("en-US", {
        timeZone: "UTC",
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    },
    {
      icon: Clock,
      label: "Time",
      value: `${start.toLocaleTimeString("en-US", {
        timeZone: "UTC",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })} – ${end.toLocaleTimeString("en-US", {
        timeZone: "UTC",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })}`,
    },
    {
      icon: MapPin,
      label: "Where",
      value: event.location,
    },
  ]

  return (
    <Card
      className={cn(
        "relative overflow-hidden p-0 bg-linear-to-br from-card via-card",
        serviceColors.gradientTo,
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl",
          serviceColors.blurSoft,
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute -bottom-16 -left-16 h-32 w-32 rounded-full blur-3xl",
          serviceColors.blurSoft,
        )}
      />
      <ul className="relative divide-y divide-border/60">
        {rows.map(({ icon: Icon, label, value }) => (
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
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}
