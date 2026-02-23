import { Badge } from "@/components/ui/badge"
import { Shield } from "lucide-react"
import { OrganizationSwitcher } from "./organization-switcher"
import { getCurrentUser, getOrganizations } from "@/lib/services/data"

 export async function DashboardHeader() {
  const [user, organizations] = await Promise.all([
    getCurrentUser(),
    getOrganizations(),
  ])

  // Filter orgs by membership for non-admins
  const userOrgIds = user.memberships.map((m) => m.organizationId)
  const visibleOrganizations = user.isAdmin
    ? organizations
    : organizations.filter((org) => userOrgIds.includes(org.id))

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-card via-card to-muted/30 p-6 sm:p-8">
      <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">
              {`Welcome back, ${user.name.split(" ")[0]}`}
            </h1>
            {user.isAdmin && (
              <Badge className="gap-1.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">
                <Shield className="h-3 w-3" />
                Admin
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {user.isAdmin
              ? "Platform overview and management"
              : "Your organizations and schedule"}
          </p>
        </div>
        <div className="w-full sm:w-[320px]">
          <OrganizationSwitcher
            organizations={visibleOrganizations}
            selectedOrgId={null}
            isAdmin={user.isAdmin}
          />
        </div>
      </div>
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-chart-2/5 blur-3xl" />
    </div>
  )
}
