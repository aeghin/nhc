import Link from "next/link";
import { ArrowUpRight, Calendar, Users, TriangleAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getRoleConfig, volunteerRoleConfig } from "@/lib/config/roles";
import { OrgRole, VolunteerRole } from "@/generated/prisma/enums";

interface OrganizationCardProps {
  organization: {
    id: string
    name: string
    description: string
    logoUrl: string | null
    role: OrgRole
    memberCount: number
    invitationCount: number
    volunteerRoles: VolunteerRole[]
    eventAssignmentCount: number
  }
  upcomingEvents?: number
};


export function OrganizationCard({ organization, upcomingEvents }: OrganizationCardProps ) {

  const roleConfig = getRoleConfig(organization.role)
  const RoleIcon = roleConfig.icon;

  const isAdmin = organization.role === OrgRole.OWNER || organization.role === OrgRole.ADMIN;

  const volunterRoles = organization.volunteerRoles;

  const count = 1;


  return (
    <Link href={`/dashboard/organizations/${organization.id}`} className="min-w-0">
      <Card
        className={cn(
          "group relative cursor-pointer overflow-hidden border-border/40 bg-linear-to-br from-card to-card/80",
          "transition-all duration-300",
          "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
        )}
      >
       
        <div className="absolute inset-0 bg-linear-to-br from-primary/2 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <CardContent className="relative p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0 space-y-4">
              
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl text-lg font-bold transition-transform duration-200 group-hover:scale-105",
                    "bg-primary/10 text-primary",
                  )}
                >
                  {organization.logoUrl ? (
                    <img
                      src={organization.logoUrl}
                      alt={`${organization.name} logo`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    organization.name.charAt(0)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                    {organization.name}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">{organization.description}</p>
                </div>
              </div>

              
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className={cn("text-xs font-medium", roleConfig.className)}>
                  <RoleIcon />
                  {roleConfig.label}
                </Badge>
                {
                volunterRoles.map((role) => {
                  const config = volunteerRoleConfig[role]
                  return (
                    <Badge key={role} variant="outline" className="text-xs font-medium">
                      <span className="leading-none">{config.icon}</span>
                      {config.label}
                    </Badge>
                  )
                })
              }
              </div>
            </div>
            <ArrowUpRight className="h-5 w-5 text-muted-foreground opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
          </div>

         
          <div className="mt-5 flex items-center gap-4 border-t border-border/40 pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="font-medium">{organization.memberCount}</span>
              <span>members</span>
            </div>
            {/* {typeof upcomingEvents === "number" && upcomingEvents > 0 && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span className="font-medium">{upcomingEvents}</span>
                <span>upcoming</span>
              </div>
            )} */}
            {organization.invitationCount > 0 && isAdmin && (
              <Badge variant="secondary" className="bg-primary/10 text-primary font-medium text-xs">
                {organization.invitationCount} pending
              </Badge>
            )}
            {organization.eventAssignmentCount > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex" tabIndex={0}>
                    <TriangleAlert className="size-4 text-primary" />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="border border-border/60 bg-muted text-foreground shadow-md [&_svg]:bg-muted [&_svg]:fill-muted">
                  <p>Pending Invites</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
