import "server-only";

import prisma from "@/lib/prisma";



export const getSmartSchedulingStatus = async (organizationId: string) => {

        const status = await prisma.organization.findUnique({
            where: {
                id: organizationId
            },
            select: {
                smartSchedulingEnabled: true
            },
        });

        return status;
};