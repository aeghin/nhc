"use server";

import { currentUser } from "@/lib/services/user";
import prisma from "@/lib/prisma";
import { OrgRole, VolunteerRole } from "@/generated/prisma/enums";
import { revalidatePath, updateTag } from "next/cache";
import { userRoleSchema, UserRoleInput } from "../validations/roles";

type ActionResponse = { success: true, role?: OrgRole } | 
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

export const removeMember = async (userId: string, organizationId: string): Promise<ActionResponse> => {

    try {

        const user = await currentUser();

        if (!user) return { success: false, error: "Unauthorized" };

        if (!userId || !organizationId) return { success: false, error: "No data received" };

        if (user.id === userId) return { success: false, error: "You cannot remove yourself. Transfer ownership or use the leave-organization flow." };

        const member = await prisma.membership.findUnique({
            where: {
                userId_organizationId: {
                    userId,
                    organizationId
                }
            }
        });

        if (!member) return { success: false, error: "Unable to find membership" };

        const assignee = await prisma.membership.findUnique({
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

        if (!assignee) return { success: false, error: "Unable to find membership" };

        if (assignee.role === OrgRole.MEMBER || member.role === OrgRole.OWNER) return { success: false, error: "Insufficient permission, reach out to owner." };

        if (assignee.role === OrgRole.ADMIN && member.role !== OrgRole.MEMBER) return { success: false, error: "Admins can only remove members." };

        await prisma.membership.delete({
            where: {
                userId_organizationId: {
                    userId,
                    organizationId
                }
            }
        });

        updateTag(`user-${userId}-roles`);
        updateTag(`user-${userId}-orgs`);
        updateTag(`user-${userId}-events-${organizationId}`);

        revalidatePath(`/dashboard/organizations/${organizationId}`);

        return { success: true };

    } catch (err) {

        console.error(err)
        return { success: false, error: "Unable to process request" };
    }
}


export const updateVolunteerRoles = async (userId: string, organizationId: string, role: VolunteerRole): Promise<ActionResponse> => {
    

    try {

    if (!userId || !organizationId || !role) return { success: false, error: "No data received" };

    const user = await currentUser(); 
    
    if (!user) return { success: false, error: "Unauthorized" };



    return { success: true }    

    } catch {
        return { success: false, error: "Something went wrong, pleasee try again."}
    }

}