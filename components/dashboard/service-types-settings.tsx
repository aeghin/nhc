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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tags, Trash2, AlertCircle, Pencil } from "lucide-react";
import { deleteServiceType, editServiceType } from "@/lib/actions/service-type";
import {
  SERVICE_TYPE_COLORS,
  getServiceColorClasses,
} from "@/lib/config/service-colors";
import { serviceTypeSchema } from "@/lib/validations/service-types";
import { cn } from "@/lib/utils";
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

export const ServiceTypesSettings = ({
  organizationId,
  serviceTypes,
}: ServiceTypesSettingsProps) => {

  const [typeToDelete, setTypeToDelete] = useState<ServiceTypeItem | null>(null);
  const [typeToEdit, setTypeToEdit] = useState<ServiceTypeItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("indigo");
  const [editError, setEditError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const openEdit = (serviceType: ServiceTypeItem) => {
    setTypeToEdit(serviceType);
    setEditName(serviceType.name);
    setEditColor(serviceType.color);
    setEditError(null);
  };

  const handleEdit = () => {

    if (!typeToEdit) return;

    const parsed = serviceTypeSchema.safeParse({ name: editName, color: editColor });

    if (!parsed.success) {
      setEditError(parsed.error.issues[0].message);
      return;
    }

    startTransition(async () => {

      const result = await editServiceType({
        organizationId,
        serviceTypeId: typeToEdit.id,
        name: parsed.data.name,
        color: parsed.data.color,
      });

      if (result.success) {
        toast.success(`${parsed.data.name} has been updated!`, { position: "top-center" });
        setTypeToEdit(null);
      } else {
        setEditError(result.error);
      }
    });
  };

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
              const colors = getServiceColorClasses(serviceType.color);

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
                  <div className="flex shrink-0 items-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={isPending}
                      className="h-8 w-8 cursor-pointer text-muted-foreground hover:text-foreground"
                      onClick={() => openEdit(serviceType)}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit {serviceType.name}</span>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={isPending}
                      className="h-8 w-8 cursor-pointer text-muted-foreground hover:text-destructive"
                      onClick={() => setTypeToDelete(serviceType)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete {serviceType.name}</span>
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <Dialog
        open={typeToEdit !== null}
        onOpenChange={(open) => {
          if (!open) setTypeToEdit(null);
        }}
      >
        <DialogContent className="sm:max-w-120">
          <DialogHeader>
            <DialogTitle>Edit Service Type</DialogTitle>
            <DialogDescription>
              Renaming updates this type everywhere it appears, including on past
              events.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="service-type-name">Name</Label>
              <Input
                id="service-type-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                maxLength={25}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-1.5">
                {SERVICE_TYPE_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setEditColor(color)}
                    className={cn(
                      "h-6 w-6 cursor-pointer rounded-full transition-all",
                      getServiceColorClasses(color).dot,
                      editColor === color
                        ? "ring-2 ring-offset-1 ring-primary"
                        : "hover:scale-110",
                    )}
                  >
                    <span className="sr-only">{color}</span>
                  </button>
                ))}
              </div>
            </div>

            {editError && <p className="text-xs text-red-500">{editError}</p>}
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => setTypeToEdit(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={isPending}
              onClick={handleEdit}
            >
              {isPending && <Spinner />}
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
