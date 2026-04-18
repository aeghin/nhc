"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button";

import { MoreVertical, Shield, Users, Trash2 } from "lucide-react";

import { OrgRole } from "@/generated/prisma/enums";

interface RoleAssignButtonsProps {
    userId: string;
    organizationId: string;
    currentRole: OrgRole;
}

export const RoleAssignButtons = ({ currentRole, userId, organizationId }: RoleAssignButtonsProps) => {

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 cursor-pointer opacity-0 transition-opacity group-hover:opacity-100 hover:bg-transparent focus-visible:ring-0 focus-visible:border-transparent"
                >
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Change Role
                </DropdownMenuLabel>
                <DropdownMenuRadioGroup value={currentRole}>
                    <DropdownMenuRadioItem value={OrgRole.ADMIN} className="cursor-pointer">
                        <Shield className="mr-2 h-4 w-4" />
                        Admin
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value={OrgRole.MEMBER} className="cursor-pointer">
                        <Users className="mr-2 h-4 w-4" />
                        Member
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove Member
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
