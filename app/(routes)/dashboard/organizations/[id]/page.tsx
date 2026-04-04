import { AnimatedSection } from "@/components/dashboard/animate-section";
import { BackLink } from "@/components/dashboard/back-link-button";
import { OrganizationHero } from "@/components/dashboard/organization-hero";
import { UserRolesSection } from "@/components/dashboard/user-roles-section";
import { OrganizationStatsGrid } from "@/components/dashboard/org-stats-grid";
import { OrganizationTabsSection } from "@/components/dashboard/org-tabs-section";
import { StatsGridSkeleton } from "@/components/dashboard/org-stats-skeleton";
import { UserRolesSkeleton } from "@/components/dashboard/user-roles-skeleton";
import { TabsSkeleton } from "@/components/dashboard/org-tabs-skeleton";

import { notFound } from "next/navigation";
import { z } from "zod/v4";
import { Suspense } from "react";
import { getOrganizationDetailsById } from "@/lib/services/organization";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { OrgRole } from "@/generated/prisma/enums";


export default async function OrganizationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>
}) {
  const { id } = await params;
  const { tab = "event" } = await searchParams;

  const { data, success } = z.uuid().safeParse(id);
  
  if (!success) notFound();

  const { userId } = await auth();

  if (!userId) redirect('/sign-in');

  const organization = await getOrganizationDetailsById(data, userId);

  if (!organization) notFound();

  const userRole = organization.memberships[0].role;

  const canManage = userRole === OrgRole.OWNER || userRole === OrgRole.ADMIN;


 return (
    <main className="mx-auto max-w-screen-2xl px-6 py-8">
      <div className="space-y-8">
        <AnimatedSection delay={0.05}>
          <BackLink href="/dashboard" label="Back to Dashboard" />
        </AnimatedSection>
 
        <AnimatedSection delay={0.1}>
          <OrganizationHero
            organization={organization}
          />
        </AnimatedSection>
 
        <Suspense fallback={<UserRolesSkeleton />}>
          <UserRolesSection
            organizationId={organization.id}
            userId={userId}
          />
        </Suspense>
 
        <Suspense fallback={<StatsGridSkeleton />}>
          <OrganizationStatsGrid
            organizationId={organization.id}
            userId={userId}
          />
        </Suspense>
 
        <AnimatedSection delay={0.3}>
          <Suspense fallback={<TabsSkeleton />}>
            <OrganizationTabsSection
              organizationId={organization.id}
              organizationName={organization.name}
              canManage={canManage}
              userId={userId}
              activeTab={tab}
            />
          </Suspense>
        </AnimatedSection>
      </div>
    </main>
  )
}

