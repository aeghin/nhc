"use server";

import prisma from "@/lib/prisma";
import { ServiceType, OrgRole } from "@/generated/prisma/client";
import { currentUser } from "@/lib/services/user";
import { revalidatePath, updateTag } from "next/cache";



type ActionResponse = 
  | { success: true; serviceType: ServiceType }
  | { success: false; error: string };


export async function createServiceType(name: string, color: string, organizationId: string): Promise<ActionResponse> {
    try {

        if (!name || !color || !organizationId) return { success: false, error: "no data received, try again"};
        
        const user = await currentUser();

        if (!user) return { success: false, error: "Unable to find user" };

        const userRole = await prisma.membership.findUnique({
            where: {
                userId_organizationId: {
                    userId: user.id, 
                    organizationId
                }
            },
            select: {
                role: true
            }
        });

        if (!userRole) return { success: false, error: "Unable to locate membership" };

        if (userRole.role === OrgRole.MEMBER) return { success: false, error: "Unauthorized" };

        const existingServiceType = await prisma.serviceType.findUnique({
            where: {
                name_organizationId: {
                    name,
                    organizationId
                }
            }
        });

        if (existingServiceType) return { success: false, error: "Service Type exists" };

        const serviceType = await prisma.serviceType.create({
            data : {
                name,
                color,
                organizationId
            }
        });

        updateTag(`org-${organizationId}-st`);
        revalidatePath(`/dashboard/organizations/${organizationId}/events/create`);

        return { success: true, serviceType: serviceType };

    } catch (err) {
        console.log(err);
        return { success: false, error: "something went wrong, try again."}
    };
};