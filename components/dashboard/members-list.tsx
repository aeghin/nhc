"use client"

import { MoreHorizontal, Shield, Crown, User, Mail, UserCog, Trash2, Phone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { OrgRole, VolunteerRole } from "@/generated/prisma/enums";
import { getRoleConfig, volunteerRoleConfig } from "@/lib/config/roles";

import { cn } from "@/lib/utils";

interface Members {
  volunteerRoles: VolunteerRole[]
  role: OrgRole
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    userImageUrl: string | null
    createdAt: Date
  }
}

interface MembersListProps {
  members: Members[]
  canManage?: boolean
}

export function MembersList({ members, canManage = false }: MembersListProps) {
  

  const formatName = (name: string) =>
    name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

const formatPhone = (phone: string) => {                                                                        
    const digits = phone.replace(/\D/g, "").replace(/^1/, "");                                                    
    if (digits.length !== 10) return phone;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;                                      
  };    

  return (
    <div className="divide-y divide-border/40">
      {members.map((member) => {
        const roleConfig = getRoleConfig(member.role)
        const RoleIcon = roleConfig.icon
        const volunteerRoles = member.volunteerRoles.map((role) => volunteerRoleConfig[role])

        return (
          <div
            key={member.user.id}
            className="group flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-accent/30"
          >
            <div className="flex items-center gap-4">
              <Avatar className="h-11 w-11 transition-transform group-hover:scale-105">
                <AvatarImage src={member.user.userImageUrl ?? undefined}/>
                <AvatarFallback className="bg-linear-to-br text-xsm font-semibold text-foreground">
                  {member.user.firstName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{`${formatName(member.user.firstName)} ${formatName(member.user.lastName)}`}</span>
                  <Badge variant="outline" className={cn("text-[10px] font-medium", roleConfig.className)}>
                    <RoleIcon className="mr-1 h-3 w-3" />
                    {roleConfig.label}
                  </Badge>
                  {volunteerRoles.map(({ label, icon }) => (
                    <Badge
                      key={label}
                      variant="secondary"
                      className="gap-1 bg-muted/50 text-[10px] font-normal"
                    >
                      <span aria-hidden>{icon}</span>
                      {label}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                 <Mail className="h-3 w-3" />                                                                              
                 {member.user.email}
                 </span>                                                                                                     
                 <span className="text-border">•</span>
                 <span className="inline-flex items-center gap-1.5 tabular-nums">                                            
                 <Phone className="h-3 w-3" />
                 {formatPhone(member.user.phoneNumber)}                                                                    
                 </span>    
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">
                Joined{" "}
                {new Date(member.user.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              {canManage && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem className="cursor-pointer">
                      <UserCog className="mr-2 h-4 w-4" />
                      Change Role
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove Member
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}