"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { organizationSchema, OrganizationInput } from "@/lib/validations/organization";
import { revalidatePath, updateTag } from "next/cache";
import { OrgRole } from "@/generated/prisma/enums";


type ActionResponse =
  | { success: true; orgId?: string }
  | { success: false; error: string }


export async function createOrganization(data: OrganizationInput): Promise<ActionResponse> {

    try {
        
        const { userId } = await auth();

        if (!userId) return { success: false, error: "Unauthorized" };

        const user = await prisma.user.findUnique({
            where: { clerkId: userId }
        });

        if (!user) return { success: false, error: "Unauthorized" };

        const { name, description } = organizationSchema.parse(data);

        const orgExists = await prisma.organization.findFirst({
            where: {
                name,
                memberships: {
                    some: {
                        userId: user.id,
                        role: OrgRole.OWNER
                    }
                }
            },
        });

        if (orgExists) {
            return { success: false, error: 'Organization exists' }
        };

        const organization = await prisma.$transaction(async (trx) => {
            const org = await trx.organization.create({
                data: {
                    name,
                    description
                }
            });

            await trx.membership.create({
                data: {
                    userId: user.id,
                    organizationId: org.id,
                    role: OrgRole.OWNER
                }
            });

            return org;
        });

        updateTag(`user-${user.id}-orgs`);
        updateTag(`user-${user.id}-memberships`);
        revalidatePath('/dashboard');
        
        return { success: true, orgId: organization.id }
        
    } catch (error) {

        console.error('createOrganization error:', error)

        return { success: false, error: 'Something went wrong' }
    };
};


export const updateOrganizationDetails = async (organizationId: string, values: OrganizationInput): Promise<ActionResponse> => {

    try {

        const { userId } = await auth();

        if (!userId) return { success: false, error: "Unauthorized" };

        const { name, description } = organizationSchema.parse(values);

        const user = await prisma.user.findUnique({
            where: {
                clerkId: userId
            },
        });

        if (!user) return { success: false, error: "Unable to find the user" };

        const currentUser = await prisma.membership.findFirst({
            where: {
                userId: user.id,
                organizationId,
                role: OrgRole.OWNER
            },
        });

        if (!currentUser) return { success: false, error: "Unable to make edits. Please reach out to an owner."}

        
        await prisma.organization.update({
            where: {
                id: organizationId
            },
            data: {
                name,
                description
            }
        });

        revalidatePath("/dashboard");
        revalidatePath(`/dashboard/organizations/${organizationId}`);
        revalidatePath(`/dashboard/organizations/${organizationId}/settings`);
        revalidatePath(`/dashboard/organizations/${organizationId}/events/create`);

        
        return { success: true };

    } catch (err) {
        return { success: false, error: "Something went wrong, please try again." }
    }
}
