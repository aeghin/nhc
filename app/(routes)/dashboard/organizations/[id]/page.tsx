import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Crown,
  Mail,
  MoreHorizontal,
  Plus,
  Settings,
  Shield,
  Trash2,
  UserCog,
  Users,
  Calendar,
  Music,
} from "lucide-react";
// import { Navbar } from "@/components/dashboard/navbar"
// import { MembersList } from "@/components/dashboard/members-list"
// import { StatsCard } from "@/components/dashboard/stats-card"
// import { UserRolesCard } from "@/components/dashboard/user-roles-card"
// import { EventsList } from "@/components/dashboard/events-list"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// import {
//   getOrganizationById,
//   getMembersByOrganization,
//   getInvitationsByOrganization,
//   getNotifications,
//   getCurrentUser,
//   getEventsByOrganization,
// } from "@/lib/services/data"
import { cn } from "@/lib/utils"
import { CheckCircle2, Clock, RefreshCw, Send, XCircle } from "lucide-react"
import type { Invitation } from "@/lib/types"

export default async function OrganizationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

//   const [organization, members, invitations, notifications, user, events] = await Promise.all([
//     getOrganizationById(id),
//     getMembersByOrganization(id),
//     getInvitationsByOrganization(id),
//     getNotifications(),
//     getCurrentUser(),
//     getEventsByOrganization(id),
//   ])

//   if (!organization) {
//     notFound()
//   }

//   const pendingInvitations = invitations.filter((inv) => inv.status === "pending").length
//   const acceptedInvitations = invitations.filter((inv) => inv.status === "accepted").length
//   const upcomingEvents = events.filter((e) => e.status === "upcoming").length
//   const userAcceptedEvents = events.filter((e) => e.acceptedVolunteers.some((v) => v.userId === user.id))

//   // Get user's roles in this organization
//   const userMembership = user.memberships.find((m) => m.organizationId === id)
//   const userRoles = userMembership?.roles || []

//   const canManage = user.isAdmin || organization.role === "owner" || organization.role === "admin"

//   const getRoleConfig = (role: string) => {
//     switch (role) {
//       case "owner":
//         return { icon: Crown, label: "Owner", className: "bg-chart-4/10 text-chart-4 border-chart-4/20" }
//       case "admin":
//         return { icon: Shield, label: "Admin", className: "bg-primary/10 text-primary border-primary/20" }
//       default:
//         return { icon: Users, label: "Member", className: "bg-muted text-muted-foreground border-border" }
//     }
//   }

//   const getPlanBadge = (plan: string) => {
//     switch (plan) {
//       case "enterprise":
//         return "bg-chart-3/10 text-chart-3 border-chart-3/20"
//       case "pro":
//         return "bg-primary/10 text-primary border-primary/20"
//       default:
//         return "bg-muted text-muted-foreground border-border"
//     }
//   }

//   const getStatusConfig = (status: Invitation["status"]) => {
//     switch (status) {
//       case "accepted":
//         return { icon: CheckCircle2, label: "Accepted", className: "bg-chart-1/10 text-chart-1 border-chart-1/20" }
//       case "declined":
//         return {
//           icon: XCircle,
//           label: "Declined",
//           className: "bg-destructive/10 text-destructive border-destructive/20",
//         }
//       case "expired":
//         return { icon: Clock, label: "Expired", className: "bg-muted text-muted-foreground border-border" }
//       default:
//         return { icon: Clock, label: "Pending", className: "bg-chart-4/10 text-chart-4 border-chart-4/20" }
//     }
//   }

//   const roleConfig = getRoleConfig(organization.role)
//   const RoleIcon = roleConfig.icon

  return (
    <div className="min-h-screen bg-background">
      {/* <Navbar notifications={notifications} user={user} /> */}
      <main className="mx-auto max-w-screen-2xl px-6 py-8">
        <div className="space-y-8">
          {/* Back Button & Header */}
          <div className="space-y-4">
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Dashboard
            </Link>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform hover:scale-105">
                  {/* <span className="text-xl font-semibold">{organization.name.charAt(0)}</span> */}
                </div>
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    {/* <h1 className="text-2xl font-semibold tracking-tight">{organization.name}</h1> */}
                    {/* <Badge variant="outline" className={cn("text-xs font-medium", roleConfig.className)}> */}
                      {/* <RoleIcon className="mr-1 h-3 w-3" /> */}
                      {/* {roleConfig.label} */}
                    {/* </Badge> */}
                    {/* <Badge
                      variant="outline"
                      className={cn("text-xs font-medium capitalize", getPlanBadge(organization.plan))}
                    >
                      {organization.plan}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{organization.description}</p> */}
                </div>
              </div>

              {canManage && (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="transition-all hover:border-primary/30 bg-transparent">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                  <Button size="sm" className="transition-all hover:scale-105">
                    <Plus className="mr-2 h-4 w-4" />
                    Invite Member
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* User's Roles in this Organization */}
          {/* {userRoles.length > 0 && <UserRolesCard roles={userRoles} organizationName={organization.name} />} */}

          {/* Stats */}
          {/* <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatsCard title="Members" value={organization.memberCount} icon={Users} />
            <StatsCard title="Pending Invites" value={pendingInvitations} icon={Mail} />
            <StatsCard title="Upcoming Events" value={upcomingEvents} icon={Calendar} />
            <StatsCard title="My Events" value={userAcceptedEvents.length} icon={CheckCircle2} />
            <StatsCard title="My Roles" value={userRoles.length} icon={Music} />
          </div> */}

          {/* Tabs for Members, Events & Invitations */}
          <Tabs defaultValue="events" className="space-y-4">
            <TabsList className="bg-secondary/50">
              <TabsTrigger value="events" className="data-[state=active]:bg-background transition-all">
                <Calendar className="mr-2 h-4 w-4" />
                Events ({events.length})
              </TabsTrigger>
              <TabsTrigger value="my-events" className="data-[state=active]:bg-background transition-all">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                My Events ({userAcceptedEvents.length})
              </TabsTrigger>
              <TabsTrigger value="members" className="data-[state=active]:bg-background transition-all">
                <Users className="mr-2 h-4 w-4" />
                Members ({members.length})
              </TabsTrigger>
              {canManage && (
                <TabsTrigger value="invitations" className="data-[state=active]:bg-background transition-all">
                  <Mail className="mr-2 h-4 w-4" />
                  Invitations ({invitations.length})
                </TabsTrigger>
              )}
              {canManage && (
                <TabsTrigger value="settings" className="data-[state=active]:bg-background transition-all">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </TabsTrigger>
              )}
            </TabsList>

            {/* <TabsContent value="events">
              <EventsList events={events} userId={user.id} title="All Events" />
            </TabsContent>

            <TabsContent value="my-events">
              <EventsList events={userAcceptedEvents} userId={user.id} title="Events I've Accepted" />
            </TabsContent> */}

            <TabsContent value="members">
              <Card className="border-border/50 bg-card">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="text-lg font-semibold">Team Members</CardTitle>
                  {canManage && (
                    <Button size="sm" variant="outline">
                      <UserCog className="mr-2 h-4 w-4" />
                      Manage Roles
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="p-0">
                  {members.length === 0 ? (
                    <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
                      No members found
                    </div>
                  ) : (
                    <MembersList members={members} canManage={canManage} />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {canManage && (
              <TabsContent value="invitations">
                <Card className="border-border/50 bg-card">
                  <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <CardTitle className="text-lg font-semibold">Invitations</CardTitle>
                    {canManage && (
                      <Button size="sm" className="transition-all hover:scale-105">
                        <Plus className="mr-2 h-4 w-4" />
                        Send Invitation
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="p-0">
                    {invitations.length === 0 ? (
                      <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
                        No invitations found
                      </div>
                    ) : (
                      <div className="divide-y divide-border/50">
                        {invitations.map((invitation) => {
                          const statusConfig = getStatusConfig(invitation.status)
                          const StatusIcon = statusConfig.icon

                          return (
                            <div
                              key={invitation.id}
                              className="group flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-accent/30"
                            >
                              <div className="flex items-center gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium text-secondary-foreground transition-transform group-hover:scale-105">
                                  {invitation.email.charAt(0).toUpperCase()}
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">{invitation.email}</span>
                                    <Badge
                                      variant="outline"
                                      className={cn("text-[10px] font-medium capitalize", statusConfig.className)}
                                    >
                                      <StatusIcon className="mr-1 h-3 w-3" />
                                      {statusConfig.label}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {invitation.role} · Invited by {invitation.invitedBy}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                  {new Date(invitation.sentAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                                {canManage && (
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                                      >
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      {invitation.status === "pending" && (
                                        <>
                                          <DropdownMenuItem className="cursor-pointer">
                                            <RefreshCw className="mr-2 h-4 w-4" />
                                            Resend Invitation
                                          </DropdownMenuItem>
                                          <DropdownMenuSeparator />
                                        </>
                                      )}
                                      {invitation.status === "expired" && (
                                        <>
                                          <DropdownMenuItem className="cursor-pointer">
                                            <Send className="mr-2 h-4 w-4" />
                                            Send New Invitation
                                          </DropdownMenuItem>
                                          <DropdownMenuSeparator />
                                        </>
                                      )}
                                      <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Remove
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {canManage && (
              <TabsContent value="settings">
                <Card className="border-border/50 bg-card">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Organization Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Organization Name</label>
                        <div className="rounded-md border border-border/50 bg-secondary/30 px-3 py-2 text-sm">
                          {organization.name}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Plan</label>
                        <div className="rounded-md border border-border/50 bg-secondary/30 px-3 py-2 text-sm capitalize">
                          {organization.plan}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <div className="rounded-md border border-border/50 bg-secondary/30 px-3 py-2 text-sm">
                        {organization.description}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4 border-t border-border/50">
                      <Button variant="outline">Edit Details</Button>
                      <Button
                        variant="outline"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive bg-transparent"
                      >
                        Delete Organization
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
    </div>
  )
}
