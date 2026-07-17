"use client";

import { useState, useTransition } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Tags, Trash2, AlertCircle } from "lucide-react";
import { deleteServiceType } from "@/lib/actions/service-type";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

type ServiceTypeItem = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  color: string;
  deletedAt: Date | null;
};

interface ServiceTypesSettingsProps {
  organizationId: string;
  serviceTypes: ServiceTypeItem[];
};

const colorClasses: Record<string, { dot: string }> = {
  indigo: { dot: "bg-indigo-500" },
  amber: { dot: "bg-amber-500" },
  emerald: { dot: "bg-emerald-500" },
  pink: { dot: "bg-pink-500" },
  violet: { dot: "bg-violet-500" },
  red: { dot: "bg-red-500" },
  blue: { dot: "bg-blue-500" },
  cyan: { dot: "bg-cyan-500" },
};

const getColorClasses = (color: string) =>
  colorClasses[color] || colorClasses.indigo;

export const ServiceTypesSettings = ({
  organizationId,
  serviceTypes,
}: ServiceTypesSettingsProps) => {

  const [typeToDelete, setTypeToDelete] = useState<ServiceTypeItem | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {

     if (!typeToDelete) return;

     startTransition(async () => {

      const result = await deleteServiceType(organizationId, typeToDelete.id);

      if (result.success) {
        toast.success(`${typeToDelete.name} has been deleted!`, { position: "top-center" });
        setTypeToDelete(null)
      } else {
        toast.error("Unable to delete this service type", { position: "top-center" });
      }
     })
  };

  return (
    <section className="rounded-xl border border-border/40 bg-secondary/10 p-5">
      <div className="flex items-center gap-2">
        <Tags className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold">Service Types</h3>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Color-coded categories for your events. Deleting one removes it from
        new events and templates; past events keep it.
      </p>

      <div className="mt-3 overflow-hidden rounded-xl border border-border/40 bg-background/50">
        {serviceTypes.length === 0 ? (
          <p className="p-4 text-sm italic text-muted-foreground">
            No service types yet. You can create one while creating an event.
          </p>
        ) : (
          <ul className="divide-y divide-border/40">
            {serviceTypes.map((serviceType) => {
              const colors = getColorClasses(serviceType.color);

              return (
                <li
                  key={serviceType.id}
                  className="flex items-center justify-between gap-3 px-4 py-2.5"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span
                      className={`h-2.5 w-2.5 shrink-0 rounded-full ${colors.dot}`}
                    />
                    <span className="truncate text-sm font-medium">
                      {serviceType.name}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={isPending}
                    className="h-8 w-8 shrink-0 cursor-pointer text-muted-foreground hover:text-destructive"
                    onClick={() => setTypeToDelete(serviceType)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete {serviceType.name}</span>
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <Dialog
        open={typeToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setTypeToDelete(null);
        }}
      >
        <DialogContent className="sm:max-w-120">
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <DialogTitle className="text-center text-xl text-red-600">
              Delete Service Type
            </DialogTitle>
            <DialogDescription className="text-center">
              {"Deleting "}
              <span className="text-red-600">{typeToDelete?.name}</span>
              {
                " removes it as an option for new events and templates. Past events will keep it."
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => setTypeToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={isPending}
              onClick={handleDelete}
            >
              {isPending && <Spinner />}
              {isPending ? "Deleting..." : "Delete Service Type"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};
