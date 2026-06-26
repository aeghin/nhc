"use client";

import { useState, useTransition } from "react";
import { CalendarClock } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { setSmartScheduling } from "@/lib/actions/organizations";

interface SmartSchedulingToggleProps {
  organizationId: string;
  enabled: boolean;
}

export const SmartSchedulingToggle = ({
  organizationId,
  enabled,
}: SmartSchedulingToggleProps) => {
  const [on, setOn] = useState(enabled);
  const [isPending, startTransition] = useTransition();

  const toggle = () => {
    const next = !on;
    setOn(next); // optimistic

    startTransition(async () => {
      const result = await setSmartScheduling(organizationId, next);

      if (result.success) {
        toast.success(
          next ? "Smart scheduling enabled" : "Smart scheduling disabled",
          { position: "top-center" },
        );
      } else {
        setOn(!next); // revert
        toast.error(result.error);
      }
    });
  };

  return (
    <section className="rounded-xl border border-border/40 bg-secondary/10 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <CalendarClock className="h-4 w-4 text-primary" />
            Smart Scheduling
          </h3>
          <p className="text-xs text-muted-foreground">
            When a volunteer declines an event invite, automatically invite the
            next available member for that role with the best acceptance rate.
          </p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={on}
          aria-label="Toggle smart scheduling"
          onClick={toggle}
          disabled={isPending}
          className={cn(
            "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
            on ? "bg-primary" : "bg-input",
          )}
        >
          <span
            className={cn(
              "inline-block h-4 w-4 rounded-full bg-background shadow transition-transform",
              on ? "translate-x-4" : "translate-x-0.5",
            )}
          />
        </button>
      </div>
    </section>
  );
};
