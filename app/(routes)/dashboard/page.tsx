import { Suspense } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { OrganizationsGrid } from "@/components/dashboard/organizations-grid";
import {
  DashboardHeaderSkeleton,
  DashboardStatsSkeleton,
  OrganizationsGridSkeleton,
} from "@/components/dashboard/skeletons";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";


export default async function DashboardPage() {

  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  return (
      <main className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="space-y-8">
          {/* <Suspense fallback={<DashboardHeaderSkeleton />}> */}
            <DashboardHeader userId={userId} />
          {/* </Suspense> */}

          <Suspense fallback={<DashboardStatsSkeleton />}>
            <DashboardStats userId={userId} />
          </Suspense>

          <Suspense fallback={<OrganizationsGridSkeleton />}>
            <OrganizationsGrid userId={userId} />
          </Suspense>

        </div>
      </main>
  )
}
