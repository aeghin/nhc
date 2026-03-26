import { notFound, redirect } from "next/navigation";
// import {
//   getOrganizationById,
//   getMembersByOrganization,
//   getServiceTypesByOrganization,
//   getCurrentUser,
// } from "@/lib/services/data";
import { CreateEventPageContent } from "@/components/dashboard/create-event-content";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { OrgRole } from "@/generated/prisma/enums";


export default async function CreateEventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: orgId } = await params

  const { userId } = await auth();
  
  if (!userId) redirect("/sign-in");

//   const [organization, members, serviceTypes, user] = await Promise.all([
//     getOrganizationById(orgId),
//     getMembersByOrganization(orgId),
//     getServiceTypesByOrganization(orgId),
//     getCurrentUser(),
//   ])

//   if (!organization) {
//     notFound()
//   }


  const user = await prisma.membership.findFirst({
    where: {
        user: {
            clerkId: userId
        },
        organizationId: orgId
    },
    include: {
        organization: {
            select: {
                name: true
            }
        }
    }
  }); 

  const members = await prisma.membership.findMany({
    where: {
        organizationId: orgId
    },
    include: {
        user: {
            select: {
                firstName: true,
                lastName: true,
                email: true,
            }
        },
    }
  });

  const serviceTypes = await prisma.serviceType.findMany({
    where: {
      organizationId: orgId
    }, 
    select: {
      id: true, 
      name: true, 
      color: true, 
    }
  });
  
  const organizationName = user?.organization.name || '';

  const canManage = user?.role === OrgRole.OWNER || OrgRole.ADMIN;

  if (!canManage) {
    redirect(`/dashboard/organizations/${orgId}`)
  }

  return (
    <CreateEventPageContent
      organizationId={orgId}
      organizationName={organizationName}
      members={members}
      serviceTypes={serviceTypes}
    />
  )
}