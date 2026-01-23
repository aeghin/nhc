"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { organizationSchema, OrganizationInput } from "@/lib/validations/organization";

type ActionResponse =
  | { success: true; orgId: string }
  | { success: false; error: string }


export async function createOrganization(data: OrganizationInput): Promise<ActionResponse> {

    try {
        
        const { userId } = await auth();

        if (!userId) return { success: false, error: "Unauthorized" };

        const { name, description } = organizationSchema.parse(data);

        const orgExists = await prisma.organization.findFirst({
            where: {
                name,
                ownerId: userId
            },
        });

        if (orgExists) {
            return { success: false, error: 'Organization exists' }
        };

        const organization = await prisma.organization.create({
            data: {
                name, 
                description, 
                ownerId: userId
            }
        });

        return { success: true, orgId: organization.id }

        
    } catch (error) {

        console.error('createOrganization error:', error)

        return { success: false, error: 'Something went wrong' }
    };
};

