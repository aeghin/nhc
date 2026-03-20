import { Users, Mail, Calendar, CheckCircle2, Music } from "lucide-react";
import { AnimatedSection } from "@/components/dashboard/animate-section";
import { StatsCard } from "@/components/dashboard/stats-card";
import { getOrgMemberCountById, getUserVolunteerRolesByOrg } from "@/lib/services/organization";


interface OrganizationStatsGridProps {
  organizationId: string
  userId: string
};

export const OrganizationStatsGrid = async ({
  organizationId,
  userId,
}: OrganizationStatsGridProps) => {

  const [memberCount, userRolesCount] = await Promise.all([
    getOrgMemberCountById(organizationId),
    getUserVolunteerRolesByOrg(organizationId, userId)
  ]);
  


  const statCards = [
    { title: "Members", value: memberCount, icon: Users },
    // { title: "Pending Invites", value: stats.pendingInvitations, icon: Mail },
    // { title: "Upcoming Events", value: stats.upcomingEvents, icon: Calendar },
    // { title: "My Events", value: stats.userAcceptedEvents, icon: CheckCircle2 },
    { title: "My Roles", value: userRolesCount, icon: Music },
  ];

  return (
    <AnimatedSection delay={0.2} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {statCards.map((stat, i) => (
        <AnimatedSection key={stat.title} delay={0.25 + i * 0.05} transition={{ duration: 0.3 }}>
          <StatsCard {...stat} />
        </AnimatedSection>
      ))}
    </AnimatedSection>
  )
}