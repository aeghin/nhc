"use server";

import { currentUser } from "@/lib/services/user";
import prisma from "@/lib/prisma";
import { OrgRole } from "@/generated/prisma/enums";
import { revalidatePath } from "next/cache";


type ActionResponse = {
    success: boolean,
    role?: OrgRole,
    error?: string,
}

export const updateUserRole = async (role: OrgRole, organizationId: string, userId: string): Promise<ActionResponse> => {
    
    try {

        const user = await currentUser();

        if (!user) return { success: false, error: "Unable to locate user" };

        const userMembership = await prisma.membership.findUnique({ 
            where: {
                userId_organizationId: {
                    userId: user?.id, 
                    organizationId
                }
            },
            select: { 
                role: true
            },
        });

        if (!userMembership) return { success: false, error: "Unable to find membership" };

        if (userMembership.role === OrgRole.MEMBER) return { success: false, error: "Unauthorized" };

        const newRole = await prisma.membership.update({
            where: {
                userId_organizationId: {
                    userId,
                    organizationId
                }
            },
            data: {
                role,
            }
        });

        revalidatePath(`/dashboard/organizations/${organizationId}?=members`)

        return { success: true, role: newRole.role };

    } catch (error) {
        return { success: false, error: "Something went wrong" };
    }


}