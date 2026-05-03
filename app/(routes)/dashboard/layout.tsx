import { Navbar } from "@/components/dashboard/navbar";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/services/user";
import { getUserMembershipCount } from "@/lib/services/organization";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {

    const user = await currentUser();

    if (!user) redirect("/sign-in");

    const membershipsCount = await getUserMembershipCount(user.id);

    if (membershipsCount < 1) redirect("/setup");

    return (
        <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20">
            <Navbar />
            {children}
        </div>
    )
};