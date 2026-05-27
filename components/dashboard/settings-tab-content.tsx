import { Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrganizationSettings } from "@/lib/services/organization";
import { EditSettingsDialog } from "./edit-settings-dialog";
import { DeleteOrgDialog } from "./delete-org-dialog";

interface SettingsTabContentProps {
  organizationId: string;
};

export const SettingsTabContent = async ({
  organizationId,
}: SettingsTabContentProps) => {
  

  const org = await getOrganizationSettings(organizationId);

  return (
  <Card className="overflow-hidden rounded-xl border-border/40 bg-linear-to-br from-card to-card/80 shadow-sm">
    <CardHeader className="border-b border-border/40 bg-secondary/20 px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Settings className="h-5 w-5 text-primary" />
        </div>
        <div>
          <CardTitle className="text-lg font-semibold">
            Organization Settings
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage your organization details
          </p>
        </div>
      </div>
    </CardHeader>

    <CardContent className="space-y-8 p-6">
      <div className="overflow-hidden rounded-xl border border-border/40 bg-secondary/10">
        <div className="space-y-3 p-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Organization Name
            </label>
            <div className="text-sm font-medium">{org?.name}</div>
          </div>

          <div className="h-px bg-border/40" />

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Description
            </label>
            <div className="text-sm text-foreground/90">
              {org?.description || (
                <span className="italic text-muted-foreground">
                  No description added yet
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-start border-t border-border/40 bg-secondary/20 px-3 py-2">
            <EditSettingsDialog
              organizationId={organizationId}
              name={org?.name ?? ""}
              description={org?.description ?? ""}
            />
        </div>
      </div>
      <section className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
        <h3 className="text-sm font-semibold text-destructive">Danger Zone</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Permanently delete this organization and all its data. This action
          cannot be undone.
        </p>
        <DeleteOrgDialog organizationId={organizationId} name={org?.name ?? ""}/>
      </section>
    </CardContent>
  </Card>
);
};