"use client";

import { useState, useTransition } from "react";
import { format, isBefore, startOfDay } from "date-fns";
import type { DateRange } from "react-day-picker";
import { CalendarOff, CalendarPlus, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  createBlockoutDate,
  deleteBlockoutDate,
} from "@/lib/actions/blockout";

export type BlockoutItem = {
  id: string;
  startDate: Date;
  endDate: Date;
};

interface BlockoutsManagerProps {
  organizationId: string;
  blockouts: BlockoutItem[];
}

const DAY_MS = 24 * 60 * 60 * 1000;


function formatBlockoutDay(date: Date, withYear: boolean): string {
  return date.toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    ...(withYear ? { year: "numeric" } : {}),
  });
}

function formatBlockoutRange(startDate: Date, endDate: Date): string {
  if (startDate.getTime() === endDate.getTime()) {
    return formatBlockoutDay(startDate, true);
  }
  return `${formatBlockoutDay(startDate, false)} – ${formatBlockoutDay(endDate, true)}`;
}

export function BlockoutsManager({
  organizationId,
  blockouts,
}: BlockoutsManagerProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const [isSaving, startSaving] = useTransition();

  const handlePickerOpenChange = (open: boolean) => {
    setIsPickerOpen(open);
    if (!open) setRange(undefined);
  };

  const handleSave = () => {
    if (!range?.from) return;

    const from = range.from;
    const to = range.to ?? range.from;

    startSaving(async () => {
      const result = await createBlockoutDate({
        organizationId,
        startDate: format(from, "yyyy-MM-dd"),
        endDate: format(to, "yyyy-MM-dd"),
      });

      if (result.success) {
        toast.success("Blockout added", { position: "bottom-center" });
        setRange(undefined);
        setIsPickerOpen(false);
      } else {
        toast.error(result.error, { position: "bottom-center" });
      }
    });
  };

  const rangeSummary = range?.from
    ? range.to && range.from.getTime() !== range.to.getTime()
      ? `${format(range.from, "MMM d")} – ${format(range.to, "MMM d, yyyy")}`
      : format(range.from, "MMM d, yyyy")
    : "Pick a day or range";

  return (
    <Card className="overflow-hidden rounded-xl border-border/40 bg-linear-to-br from-card to-card/80 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-3 border-b border-border/40 bg-secondary/20 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <CalendarOff className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">
              Blockout Dates
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Days you&apos;re unavailable — you won&apos;t be scheduled on them
            </p>
          </div>
        </div>

        <Popover open={isPickerOpen} onOpenChange={handlePickerOpenChange}>
          <PopoverTrigger asChild>
            <Button size="sm" className="shrink-0">
              <CalendarPlus className="h-4 w-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Add Blockout</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <CalendarComponent
              mode="range"
              selected={range}
              onSelect={setRange}
              numberOfMonths={1}
              disabled={(date) => isBefore(date, startOfDay(new Date()))}
            />
            <div className="flex items-center justify-between gap-3 border-t p-3">
              <p className="text-xs text-muted-foreground">{rangeSummary}</p>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={!range?.from || isSaving}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </CardHeader>

      <CardContent className="p-0">
        {blockouts.length === 0 ? (
          <div className="flex h-50 flex-col items-center justify-center gap-2 px-6 text-center text-muted-foreground">
            <CalendarOff className="h-10 w-10 opacity-20" />
            <p className="text-sm font-medium">No blockout dates</p>
            <p className="text-xs">
              Add days you&apos;re unavailable and you won&apos;t be scheduled
              on them
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {blockouts.map((blockout) => (
              <BlockoutRow
                key={blockout.id}
                blockout={blockout}
                organizationId={organizationId}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function BlockoutRow({
  blockout,
  organizationId,
}: {
  blockout: BlockoutItem;
  organizationId: string;
}) {
  const [isDeleting, startDeleting] = useTransition();

  const dayCount =
    Math.round(
      (blockout.endDate.getTime() - blockout.startDate.getTime()) / DAY_MS,
    ) + 1;

  const handleDelete = () => {
    startDeleting(async () => {
      const result = await deleteBlockoutDate(blockout.id, organizationId);

      result.success
        ? toast.success("Blockout removed", { position: "bottom-center" })
        : toast.error(result.error, { position: "bottom-center" });
    });
  };

  return (
    <div className="flex items-center gap-4 px-6 py-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
        <CalendarOff className="h-5 w-5 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {formatBlockoutRange(blockout.startDate, blockout.endDate)}
        </p>
        <p className="text-xs text-muted-foreground">
          {dayCount === 1 ? "1 day" : `${dayCount} days`}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        disabled={isDeleting}
        className="shrink-0 text-muted-foreground hover:text-destructive"
      >
        {isDeleting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
        <span className="sr-only">Remove blockout</span>
      </Button>
    </div>
  );
}
