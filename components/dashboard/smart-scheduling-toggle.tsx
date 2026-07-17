"use client";

import { useState, useTransition } from "react";
import { CalendarClock } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
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

        <Switch
          size="lg"
          checked={on}
          onCheckedChange={toggle}
          disabled={isPending}
          aria-label="Toggle smart scheduling"
          className="cursor-pointer"
        />
      </div>
    </section>
  );
};
