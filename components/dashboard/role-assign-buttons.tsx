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

import { useTransition, useState } from "react";

import { updateUserRole } from "@/lib/actions/roles";
import { toast } from "sonner";
import { ConfirmMemberDeleteModal } from "@/components/dashboard/confirm-member-delete-modal";


interface RoleAssignButtonsProps {
    userId: string;
    organizationId: string;
    currentRole: OrgRole;
}

export const RoleAssignButtons = ({ currentRole, userId, organizationId }: RoleAssignButtonsProps) => {


    const [isPending, startTransition] = useTransition();
    const [removeMemberConfirm, setRemoveMemberConfirm] = useState(false);

    const handleRoleChange = (role: string) => {
        const newRole = role as OrgRole;

        startTransition(async () => {
            toast.promise(
                updateUserRole({ userId, organizationId, role: newRole }).then((result) => {
                    if (!result.success) throw new Error(result.error);
                    return result;
                }),
                {   
                    position: "bottom-center",
                    classNames: {
                        toast: "justify-center"
                    },
                    loading: "Updating Role...",
                    success: {
                        message: "Role Updated!",
                        duration: 5000,
                    },
                    error: (err) => ({
                        message: err instanceof Error ? err.message : "Something went wrong, try again!",
                        duration: 5000,
                    }),
                }
            );
        });
    };


    return (
    <>
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
                <DropdownMenuRadioGroup value={currentRole} onValueChange={handleRoleChange}>
                    <DropdownMenuRadioItem disabled={isPending} value={OrgRole.ADMIN} className="cursor-pointer">
                         <Shield className="mr-2 h-4 w-4" />
                        Admin
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem disabled={isPending} value={OrgRole.MEMBER} className="cursor-pointer">
                       <Users className="mr-2 h-4 w-4" />
                        Member
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setRemoveMemberConfirm(true)} disabled={isPending} className="cursor-pointer text-destructive focus:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove Member
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        <ConfirmMemberDeleteModal open={removeMemberConfirm} onOpenChange={setRemoveMemberConfirm} userId={userId} organizationId={organizationId} />
    </>
    )
    
}
