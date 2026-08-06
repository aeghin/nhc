"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Check, Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { cn } from "@/lib/utils";
import { VolunteerRole } from "@/generated/prisma/enums";
import { volunteerRoleConfig } from "@/lib/config/roles";
import { addEventRoles } from "@/lib/actions/event";

const volunteerRoleEntries = Object.entries(volunteerRoleConfig) as [
  VolunteerRole,
  { label: string; icon: string },
][];

interface AddEventRolesDialogProps {
  organizationId: string;
  eventId: string;
  /** Roles already on the event — shown as locked in */
  existingRoles: VolunteerRole[];
  /** How many org members hold each role, for the "N available" hint */
  memberCountByRole: Record<string, number>;
}

export function AddEventRolesDialog({
  organizationId,
  eventId,
  existingRoles,
  memberCountByRole,
}: AddEventRolesDialogProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<VolunteerRole[]>([]);
  const [isSaving, startSaving] = useTransition();

  const existing = new Set(existingRoles);
  const selectedSet = new Set(selected);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setSelected([]);
  };

  const toggleRole = (role: VolunteerRole) => {
    if (existing.has(role)) return;

    setSelected((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  };

  const handleSave = () => {
    startSaving(async () => {
      const result = await addEventRoles(organizationId, eventId, {
        roles: selected,
      });

      if (!result.success) {
        toast.error(result.error, { position: "top-center" });
        return;
      }

      toast.success(
        `Added ${selected.length} ${selected.length === 1 ? "role" : "roles"}`,
        { position: "top-center" },
      );

      handleOpenChange(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 cursor-pointer gap-1 px-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <Plus className="h-3.5 w-3.5" />
          Add role
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add roles to this event</DialogTitle>
          <DialogDescription>
            Roles show up on the team roster as open slots you can invite into.
          </DialogDescription>
        </DialogHeader>

        <div className="grid max-h-[55vh] gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
          {volunteerRoleEntries.map(([role, config]) => {
            const alreadyOnEvent = existing.has(role);
            const isSelected = selectedSet.has(role);
            const availableCount = memberCountByRole[role] || 0;

            return (
              <button
                key={role}
                type="button"
                disabled={alreadyOnEvent}
                onClick={() => toggleRole(role)}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-4 text-left transition-all",
                  alreadyOnEvent
                    ? "cursor-not-allowed border-border bg-muted/40 opacity-70"
                    : isSelected
                      ? "cursor-pointer border-primary bg-primary/5 ring-1 ring-primary"
                      : "cursor-pointer border-border/60 bg-card/50 hover:border-primary/50 hover:bg-muted/50",
                )}
              >
                <span className="text-xl">{config.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{config.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {alreadyOnEvent
                      ? "Already on this event"
                      : `${availableCount} available`}
                  </p>
                </div>
                <div
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full border transition-colors",
                    isSelected || alreadyOnEvent
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/30",
                  )}
                >
                  {(isSelected || alreadyOnEvent) && (
                    <Check className="h-3 w-3" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            className="mr-2"
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={selected.length === 0 || isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                Add {selected.length > 0 && `(${selected.length})`}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
