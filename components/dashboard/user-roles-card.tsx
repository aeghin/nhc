import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import { cn } from "@/lib/utils"
import { Music, AlertCircle } from "lucide-react";
import { VolunteerRole } from "@/generated/prisma/enums";
import { volunteerRoleConfig } from "@/lib/config/roles";

interface UserRolesCardProps {
  roles: VolunteerRole[];
  organizationName: string;
}

export function UserRolesCard({ roles, organizationName }: UserRolesCardProps) {
  const rolesConfig = roles.map((role) => {
    const { label, icon } = volunteerRoleConfig[role];
    return (
      <Badge
        key={role}
        variant="secondary"
        className="gap-1.5 px-3 py-1.5 text-sm font-medium transition-all duration-200 hover:scale-105"
      >
        <span>{icon}</span>
        {label}
      </Badge>
    );
  });

  return (
    <Card className="group relative overflow-hidden border-border/40 bg-linear-to-br from-card to-card/80">
      {/* Decorative gradient */}
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-opacity duration-300 group-hover:opacity-70" />

      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2.5 text-base font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Music className="h-4 w-4 text-primary" />
          </div>
          <div>
            <span>Your Roles</span>
            {organizationName && (
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                in {organizationName}
              </span>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {roles.length === 0 ? (
          <div className="flex items-center gap-3 py-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm font-medium">No roles assigned yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Contact your admin to get started
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">{rolesConfig}</div>
        )}
      </CardContent>
    </Card>
  );
}
