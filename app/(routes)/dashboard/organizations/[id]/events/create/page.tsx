import { redirect } from "next/navigation";
// import {
//   getOrganizationById,
//   getMembersByOrganization,
//   getServiceTypesByOrganization,
//   getCurrentUser,
// } from "@/lib/services/data";
import { CreateEventPageContent } from "@/components/dashboard/create-event-content";
import prisma from "@/lib/prisma";
import { OrgRole } from "@/generated/prisma/enums";
import { currentUser } from "@/lib/services/user";


export default async function CreateEventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: orgId } = await params

  const user = await currentUser();

  if (!user) redirect("/sign-in");

  const { id } = user;

//   const [organization, members, serviceTypes, user] = await Promise.all([
//     getOrganizationById(orgId),
//     getMembersByOrganization(orgId),
//     getServiceTypesByOrganization(orgId),
//     getCurrentUser(),
//   ])

//   if (!organization) {
//     notFound()
//   }


  const [membership, members, serviceTypes] = await Promise.all([
    
      prisma.membership.findFirst({
      where: {
          userId: id,
          organizationId: orgId
      },
      include: {
          organization: {
              select: {
                  name: true
              }
          }
      }
    }),

    prisma.membership.findMany({
       where: {
           organizationId: orgId
       },
       include: {
           user: {
               select: {
                   firstName: true,
                   lastName: true,
                   email: true,
                   userImageUrl: true,
               }
           },
       }
     }),
     
     prisma.serviceType.findMany({
      where: {
        organizationId: orgId
      }, 
      select: {
        id: true, 
        name: true, 
        color: true, 
      }
    })
  ]) 
    


  
  const organizationName = membership?.organization.name || '';

  const canManage = membership?.role === OrgRole.OWNER || membership?.role === OrgRole.ADMIN;

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