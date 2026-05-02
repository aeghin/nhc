import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
// import { EditEventButton } from "./edit-event-button";
import { colorClasses } from "@/lib/config/service-types-config";

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

interface EventHeaderProps {
  event: Event
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
  serviceType,
}: EventHeaderProps) {
  const serviceColors = colorClasses[serviceType.color];

  const firstDate = event.dates[0]?.startTime;

  const dateParts = firstDate
    ? {
        month: firstDate.toLocaleString("en-US", { month: "short" }).toUpperCase(),
        day: firstDate.getDate(),
        weekday: firstDate.toLocaleString("en-US", { weekday: "short" }).toUpperCase(),
      }
    : null;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/40 border-l-[3px] bg-linear-to-br from-card via-card p-8",
        serviceColors.border,
        serviceColors.gradientTo,
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl",
          serviceColors.blurSoft,
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full blur-3xl",
          serviceColors.blurStrong,
        )}
      />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-5">
          {dateParts && (
            <div
              className={cn(
                "flex h-16 w-16 flex-col items-center justify-center rounded-2xl border border-border/40 bg-muted/30 shadow-lg",
                serviceColors.shadow,
              )}
            >
              <span className="text-[10px] font-bold tracking-wider text-muted-foreground">
                {dateParts.month}
              </span>
              <span className="text-2xl font-bold leading-none text-foreground">
                {dateParts.day}
              </span>
              <span className="text-[10px] text-muted-foreground">{dateParts.weekday}</span>
            </div>
          )}

          <div className="space-y-3">
            {serviceType && (
              <Badge
                className={cn(
                  "text-xs font-medium",
                  serviceColors.badge,
                  serviceColors.badgeText,
                )}
              >
                <span className={cn("mr-1.5 h-2 w-2 rounded-full", serviceColors.dot)} />
                {serviceType.name}
              </Badge>
            )}
            <h1 className="text-3xl font-bold tracking-tight text-balance">{event.name}</h1>
            {event.description && (
              <p className="max-w-lg text-muted-foreground">{event.description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}