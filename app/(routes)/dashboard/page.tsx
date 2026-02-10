import { UserButton } from "@clerk/nextjs";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { CreateOrg } from "@/components/dashboard/create-org-button";
import { redirect } from "next/navigation";
import Link from "next/link";

const DashboardPage = async () => {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
    include: {
      memberships: {
        include: {
          organization: true,
        },
      },
    },
  });

  
  const organizations = user?.memberships.map((m) => m.organization) || [];
  

  return (
    <>
      <div>
        Dashboard Page, only if authenticated. Hello, {user?.firstName}.
      </div>
      <ul>
        {organizations?.map((org) => (
          <Link key={org.id} href={`/dashboard/organizations/${org.id}`}>{org.name}</Link>
        ))}
      </ul>
      <UserButton />
      <CreateOrg />
    </>
  );
};

export default DashboardPage;
