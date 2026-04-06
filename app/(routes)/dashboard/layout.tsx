import { Navbar } from "@/components/dashboard/navbar";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/services/user";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {

    const user = await currentUser();

    const membershipsCount = await prisma.membership.count({
      where: {
        userId: user?.id
      },
    });

    if (membershipsCount < 1) redirect("/setup");

    return (
        <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20">
            <Navbar />
            {children}
        </div>
    )
};