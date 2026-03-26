"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { ServiceType } from "@/generated/prisma/client";



type ActionResponse = 
  | { success: true; serviceType: ServiceType }
  | { success: false; error: string };


export async function createServiceType(name: string, color: string, organizationId: string): Promise<ActionResponse> {
    try {

        const { userId } = await auth();

        if (!userId) return { success: false, error: "Unauthorized" };

        if (!name || !color || !organizationId) return { success: false, error: "no data received, try again"};

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

        return { success: true, serviceType: serviceType };

    } catch (err) {
        console.log(err);
        return { success: false, error: "something went wrong, try again."}
    };
};