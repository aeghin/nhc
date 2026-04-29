import { OrganizationCard } from "./organization-card";
import { getUserOrganizations } from "@/lib/services/organization";


interface OrganizationsGridProps {
  userId: string
};

export async function OrganizationsGrid({ userId }: OrganizationsGridProps) {
  
  const organizations = await getUserOrganizations(userId);
  

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">
          Your Organizations
        </h2>
        <p className="text-sm text-muted-foreground">
          Select an organization to view details and events
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {organizations.map((org) => (
          <OrganizationCard
            key={org.id}
            organization={org}
          />
        ))}
      </div>
    </div>
  )
}
