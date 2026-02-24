import { Suspense } from "react";
// import { DashboardHeader } from "@/components/dashboard/dashboard-header";
// import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { OrganizationsGrid } from "@/components/dashboard/organizations-grid";
import {
  // DashboardHeaderSkeleton,
  // DashboardStatsSkeleton,
  OrganizationsGridSkeleton,
} from "@/components/dashboard/skeletons";


export default async function DashboardPage() {

  return (
      <main className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="space-y-8">
          {/* <Suspense fallback={<DashboardHeaderSkeleton />}>
            <DashboardHeader />
          </Suspense>

          <Suspense fallback={<DashboardStatsSkeleton />}>
            <DashboardStats />
          </Suspense> */}

          <Suspense fallback={<OrganizationsGridSkeleton />}>
            <OrganizationsGrid />
          </Suspense>

        </div>
      </main>
  )
}
