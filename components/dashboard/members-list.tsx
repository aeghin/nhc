"use client"

import { MoreHorizontal, Shield, Crown, User, Mail, UserCog, Trash2 } from "lucide-react";
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

import { OrgRole } from "@/generated/prisma/enums";

// import { cn } from "@/lib/utils";

// interface Members {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phoneNumber: string,
//   userImageUrl: string,
//   createdAt: true,
// }

interface MembersListProps {
  members: any
  canManage?: boolean
}

export function MembersList({ members, canManage = false }: MembersListProps) {
  
  // const getRoleConfig = (role: Members["role"]) => {
  //   switch (role) {
  //     case "owner":
  //       return { icon: Crown, label: "Owner", className: "bg-amber-500/10 text-amber-600 border-amber-500/20" }
  //     case "admin":
  //       return { icon: Shield, label: "Admin", className: "bg-primary/10 text-primary border-primary/20" }
  //     default:
  //       return { icon: User, label: "Member", className: "bg-muted text-muted-foreground border-border" }
  //   }
  // }

  // const getInitials = (name: string) => {
  //   return name
  //     .split(" ")
  //     .map((n) => n[0])
  //     .join("")
  //     .toUpperCase()
  //     .slice(0, 2)
  // }

  // const getAvatarGradient = (name: string) => {
  //   const colors = [
  //     "from-emerald-500/20 to-teal-500/20",
  //     "from-blue-500/20 to-indigo-500/20",
  //     "from-violet-500/20 to-purple-500/20",
  //     "from-rose-500/20 to-pink-500/20",
  //     "from-amber-500/20 to-orange-500/20",
  //   ]
  //   const index = name.charCodeAt(0) % colors.length
  //   return colors[index]
  // }

  return (
    <div className="divide-y divide-border/40">
      {members.map((member: any) => {
        // const roleConfig = getRoleConfig(member.role)
        // const RoleIcon = roleConfig.icon

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
                <div className="flex items-center gap-2">
                  <span className="font-medium">{`${member.user.firstName} ${member.user.lastName}`}</span>
                  {/* <Badge variant="outline" className={cn("text-[10px] font-medium", roleConfig.className)}>
                    <RoleIcon className="mr-1 h-3 w-3" />
                    {roleConfig.label}
                  </Badge> */}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  <span>{member.user.email}</span>
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