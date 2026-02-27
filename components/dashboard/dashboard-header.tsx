import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CreateOrg } from "./create-org-button";
import { Greeting } from "./header-time-message";

 export async function DashboardHeader() {

  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { firstName: true }
  });

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-linear-to-br from-primary/5 via-card to-primary/10 p-6 sm:p-8">
      <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Greeting name={user?.firstName || "User"}/>
          </div>
          <p className="text-sm text-muted-foreground">
            Your organizations and schedule
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <CreateOrg />
        </div>
      </div>
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-chart-2/5 blur-3xl" />
    </div>
  )
}
