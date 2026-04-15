"use server";

import { currentUser } from "@/lib/services/user";
import prisma from "@/lib/prisma";
import { OrgRole } from "@/generated/prisma/enums";
import { revalidatePath } from "next/cache";
import { userRoleSchema, UserRoleInput } from "../validations/roles";

type ActionResponse = { success: true, role: OrgRole } | 
{ success: false, error: string }

export const updateUserRole = async (data: UserRoleInput): Promise<ActionResponse> => {
    
    try {

        const user = await currentUser();

        if (!user) return { success: false, error: "Unable to locate user" };

        const { role, organizationId, userId } = userRoleSchema.parse(data);

        if (user.id === userId) return { success: false, error: "Unable to change your own role. Please reach out to the owner." };

        if (role === OrgRole.OWNER) return { success: false, error: "Ownership cannot be assigned here. Use the transfer-ownership flow." };

        const userMembership = await prisma.membership.findUnique({ 
            where: {
                userId_organizationId: {
                    userId: user.id, 
                    organizationId
                }
            },
            select: { 
                role: true
            },
        });

        if (!userMembership ) return { success: false, error: "Unable to find membership" };
        
        if (userMembership.role === OrgRole.MEMBER) return { success: false, error: "Unauthorized" };

        const assignee = await prisma.membership.findUnique({
            where: {
                userId_organizationId: {
                    userId,
                    organizationId
                }
            },
            select: {
                role: true,
            }
        });

        if (!assignee) return { success: false, error: "Unable to find membership for member" };

        if (userMembership.role === OrgRole.ADMIN && assignee.role !== OrgRole.MEMBER) return { success: false, error: "Insufficient permissions. Reach out to owner." };

        const newRole = await prisma.membership.update({
            where: {
                userId_organizationId: {
                    userId,
                    organizationId
                }
            },
            data: {
                role,
            },
            select: {
                role: true
            }
        });

        revalidatePath(`/dashboard/organizations/${organizationId}`);

        return { success: true, role: newRole.role };

    } catch (error) {
        console.error(error);
        return { success: false, error: "Something went wrong" };
    }


}