import prisma from "../prisma";
import { auth } from "@clerk/nextjs/server";

export const getOrganizationById = async (id: string) => {
    
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  const organization = await prisma.organization.findUnique({
    where: {
      id,
    },
    include: {
      memberships: {
        where: {
          user: {
            clerkId: userId,
          },
        },
        select: {
          role: true,
        },
      },
    },
  });

  if (!organization || organization.memberships.length === 0) {
    return null;
  };

  return organization;
};
