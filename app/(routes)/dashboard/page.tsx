
import { UserButton } from "@clerk/nextjs";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const DashboardPage = async () => {

    const { userId } = await auth();

    const user = await prisma.user.findFirst({
        where: { clerkId: userId! },
    });

    return (
        <>
            <div>Dashboard Page, only if authenticated. Hello, {user?.firstName}</div>
            <UserButton />
        </>
    )
};

export default DashboardPage;