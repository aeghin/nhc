import { UserButton } from "@clerk/nextjs";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { CreateOrg } from "@/components/dashboard/create-org-button";

const DashboardPage = async () => {
  const { userId } = await auth();

  const user = await prisma.user.findFirst({
    where: { clerkId: userId! },
    include: {
      Organizations: true,
    },
  });

  const organizations = user?.Organizations;

  return (
    <>
      <div>
        Dashboard Page, only if authenticated. Hello, {user?.firstName}.
      </div>
      <ul>
        {organizations?.map((organization) => (
          <li key={organization.id}>{organization.name}</li>
        ))}
      </ul>
      <UserButton />
      <CreateOrg />
    </>
  );
};

export default DashboardPage;
