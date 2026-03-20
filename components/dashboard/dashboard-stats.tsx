import { Building2, Calendar, Music, Percent } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { getUserOrganizations } from "@/lib/services/organization";

interface DashboardStatsProps {
  userId: string
};

export async function DashboardStats({ userId }: DashboardStatsProps) {

  const orgs = await getUserOrganizations(userId);
  const count = orgs.length;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Organizations"
        value={count || "No Data Available"}
        icon={Building2}
      />
      {/* <StatsCard
        title="Upcoming Events"
        value={upcomingEvents}
        icon={Calendar}
      />
      <StatsCard
        title="My Accepted"
        value={userAcceptedCount}
        icon={Music}
      />
      <StatsCard
        title="Acceptance Rate"
        value={`${userAcceptanceRate}%`}
        icon={Percent}
        description={`${userAcceptedCount} of ${upcomingEvents} events`}
      /> */}
    </div>
  )
}
