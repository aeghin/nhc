import { Suspense } from "react";
import { Navbar } from "@/components/dashboard/navbar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
// import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { OrganizationsGrid } from "@/components/dashboard/organizations-grid";
import {
  DashboardHeaderSkeleton,
  DashboardStatsSkeleton,
  OrganizationsGridSkeleton,
} from "@/components/dashboard/skeletons";
// import { getNotifications, getCurrentUser } from "@/lib/services/data";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {

  // const [user, notifications] = await Promise.all([
  //   getCurrentUser(),
  //   getNotifications(),
  // ])

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20">
      <Navbar />

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
    </div>
  )
}
