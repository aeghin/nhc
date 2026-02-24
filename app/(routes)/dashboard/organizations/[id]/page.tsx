import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
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
  CheckCircle2,
  Clock,
  RefreshCw,
  Send,
  XCircle,
  Building2,
  TrendingUp,
} from "lucide-react";
// import { Navbar } from "@/components/dashboard/navbar"
// import { MembersList } from "@/components/dashboard/members-list"
// import { StatsCard } from "@/components/dashboard/stats-card"
// import { UserRolesCard } from "@/components/dashboard/user-roles-card"
// import { EventsList } from "@/components/dashboard/events-list"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import {
//   getOrganizationById,
//   getMembersByOrganization,
//   getInvitationsByOrganization,
//   getNotifications,
//   getCurrentUser,
//   getEventsByOrganization,
// } from "@/lib/services/data";
import { cn } from "@/lib/utils";
import { getOrganizationById } from "@/lib/services/organization";
// import type { Invitation } from "@/lib/types";

import { OrgRole } from "@/generated/prisma/enums";
import { InviteMemberButton } from "@/components/dashboard/invite-person-button";

export default async function OrganizationPage({ params }: { params: Promise<{ id: string }> }) {

  const { id } = await params;

  const { data, success} = z.uuid().safeParse(id);

  if (!success) notFound();

  const organization = await getOrganizationById(data);

  if (!organization) notFound();

  const userRole = organization.memberships[0].role;


  // const [organization, members, invitations, notifications, user, events] = await Promise.all([
  //   getOrganizationById(id),
  //   getMembersByOrganization(id),
  //   getInvitationsByOrganization(id),
  //   getNotifications(),
  //   getCurrentUser(),
  //   getEventsByOrganization(id),
  // ])


  // const pendingInvitations = invitations.filter((inv) => inv.status === "pending").length
  // const upcomingEvents = events.filter((e) => e.status === "upcoming").length
  // const userAcceptedEvents = events.filter((e) => e.acceptedVolunteers.some((v) => v.userId === user.id))

  // const userMembership = user.memberships.find((m) => m.organizationId === id)
  // const userRoles = userMembership?.roles || []

  const canManage = userRole === OrgRole.OWNER || userRole === OrgRole.ADMIN;

  const getRoleConfig = (role: OrgRole) => {
    switch (role) {
      case OrgRole.OWNER:
        return { icon: Crown, label: "Owner", className: "bg-amber-500/10 text-amber-600 border-amber-500/20" }
      case OrgRole.ADMIN:
        return { icon: Shield, label: "Admin", className: "bg-primary/10 text-primary border-primary/20" }
      default:
        return { icon: Users, label: "Member", className: "bg-muted text-muted-foreground border-border" }
    }
  };

  // const getPlanBadge = (plan: string) => {
  //   switch (plan) {
  //     case "enterprise":
  //       return "bg-violet-500/10 text-violet-600 border-violet-500/20"
  //     case "pro":
  //       return "bg-primary/10 text-primary border-primary/20"
  //     default:
  //       return "bg-muted text-muted-foreground border-border"
  //   }
  // }

  // const getStatusConfig = (status: Invitation["status"]) => {
  //   switch (status) {
  //     case "accepted":
  //       return { icon: CheckCircle2, label: "Accepted", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" }
  //     case "declined":
  //       return { icon: XCircle, label: "Declined", className: "bg-destructive/10 text-destructive border-destructive/20" }
  //     case "expired":
  //       return { icon: Clock, label: "Expired", className: "bg-muted text-muted-foreground border-border" }
  //     default:
  //       return { icon: Clock, label: "Pending", className: "bg-amber-500/10 text-amber-600 border-amber-500/20" }
  //   }
  // }

  const roleConfig = getRoleConfig(userRole);
  const RoleIcon = roleConfig.icon;

  return (
      <main className="mx-auto max-w-screen-2xl px-6 py-8">
        <div className="space-y-8">
          {/* Back Button */}
          <Link
            href="/dashboard"
            className="group inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </Link>

          {/* Hero Header */}
          <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-linear-to-br from-card via-card to-primary/5 p-8">
            {/* Decorative Elements */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
            
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-primary/20 to-primary/10 text-primary shadow-lg shadow-primary/10 transition-transform hover:scale-105">
                  <Building2 className="h-8 w-8" />
                </div>
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl font-bold tracking-tight">{organization?.name}</h1>
                    <Badge variant="outline" className={cn("text-xs font-medium", roleConfig.className)}>
                      <RoleIcon className="mr-1 h-3 w-3" />
                      {roleConfig.label}
                    </Badge>
                    {/* <Badge variant="outline" className={cn("text-xs font-medium capitalize", getPlanBadge(organization?.plan))}> */}
                      {/* {organization?.plan} */}
                    {/* </Badge> */}
                  </div>
                  <p className="max-w-lg text-muted-foreground">{organization?.description}</p>
                </div>
              </div>

              {canManage && (
                <div className="flex items-center gap-3">
                <InviteMemberButton organizationId={data} organizationName={organization?.name}/>
                </div>
              )}
            </div>
          </div>

          {/* User's Roles */}
          {/* {userRoles.length > 0 && <UserRolesCard roles={userRoles} organizationName={organization.name} />} */}

          {/* Stats Grid */}
          {/* <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatsCard title="Members" value={organization.memberCount} icon={Users} />
            <StatsCard title="Pending Invites" value={pendingInvitations} icon={Mail} />
            <StatsCard title="Upcoming Events" value={upcomingEvents} icon={Calendar} />
            <StatsCard title="My Events" value={userAcceptedEvents.length} icon={CheckCircle2} />
            <StatsCard title="My Roles" value={userRoles.length} icon={Music} />
          </div> */}

          {/* Tabs */}
          {/* <Tabs defaultValue="events" className="space-y-6">
            <TabsList className="inline-flex h-auto gap-1 rounded-xl bg-secondary/50 p-1">
              <TabsTrigger value="events" className="cursor-pointer rounded-lg px-4 py-2.5 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
                <Calendar className="mr-2 h-4 w-4" />
                Events ({events.length})
              </TabsTrigger>
              <TabsTrigger value="my-events" className="cursor-pointer rounded-lg px-4 py-2.5 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                My Events ({userAcceptedEvents.length})
              </TabsTrigger>
              <TabsTrigger value="members" className="cursor-pointer rounded-lg px-4 py-2.5 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
                <Users className="mr-2 h-4 w-4" />
                Members ({members.length})
              </TabsTrigger>
              {canManage && (
                <TabsTrigger value="invitations" className="cursor-pointer rounded-lg px-4 py-2.5 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
                  <Mail className="mr-2 h-4 w-4" />
                  Invitations ({invitations.length})
                </TabsTrigger>
              )}
              {canManage && (
                <TabsTrigger value="settings" className="cursor-pointer rounded-lg px-4 py-2.5 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="events" className="mt-6">
              <EventsList events={events} userId={user.id} title="All Events" userRoles={userRoles} />
            </TabsContent>

            <TabsContent value="my-events" className="mt-6">
              <EventsList events={userAcceptedEvents} userId={user.id} title="Events I've Accepted" userRoles={userRoles} />
            </TabsContent>

            <TabsContent value="members" className="mt-6">
              <Card className="overflow-hidden rounded-xl border-border/40 bg-gradient-to-br from-card to-card/80 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 bg-secondary/20 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold">Team Members</CardTitle>
                      <p className="text-sm text-muted-foreground">{members.length} total members</p>
                    </div>
                  </div>
                  {canManage && (
                    <Button size="sm" variant="outline" className="cursor-pointer bg-background/50 transition-all hover:bg-background">
                      <UserCog className="mr-2 h-4 w-4" />
                      Manage Roles
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="p-0">
                  {members.length === 0 ? (
                    <div className="flex h-[200px] flex-col items-center justify-center gap-2 text-muted-foreground">
                      <Users className="h-10 w-10 opacity-20" />
                      <p className="text-sm">No members found</p>
                    </div>
                  ) : (
                    <MembersList members={members} canManage={canManage} />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {canManage && (
              <TabsContent value="invitations" className="mt-6">
                <Card className="overflow-hidden rounded-xl border-border/40 bg-gradient-to-br from-card to-card/80 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 bg-secondary/20 px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold">Invitations</CardTitle>
                        <p className="text-sm text-muted-foreground">{pendingInvitations} pending</p>
                      </div>
                    </div>
                    <Button size="sm" className="cursor-pointer shadow-lg shadow-primary/20 transition-all hover:scale-105">
                      <Plus className="mr-2 h-4 w-4" />
                      Send Invitation
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    {invitations.length === 0 ? (
                      <div className="flex h-[200px] flex-col items-center justify-center gap-2 text-muted-foreground">
                        <Mail className="h-10 w-10 opacity-20" />
                        <p className="text-sm">No invitations found</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-border/40">
                        {invitations.map((invitation) => {
                          const statusConfig = getStatusConfig(invitation.status)
                          const StatusIcon = statusConfig.icon

                          return (
                            <div
                              key={invitation.id}
                              className="group flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-accent/30"
                            >
                              <div className="flex items-center gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-secondary/50 text-sm font-semibold text-secondary-foreground transition-transform group-hover:scale-105">
                                  {invitation.email.charAt(0).toUpperCase()}
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{invitation.email}</span>
                                    <Badge variant="outline" className={cn("text-[10px] font-medium capitalize", statusConfig.className)}>
                                      <StatusIcon className="mr-1 h-3 w-3" />
                                      {statusConfig.label}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {invitation.role} · Invited by {invitation.invitedBy}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-muted-foreground">
                                  {new Date(invitation.sentAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                </span>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer opacity-0 transition-opacity group-hover:opacity-100">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-48">
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
              <TabsContent value="settings" className="mt-6">
                <Card className="overflow-hidden rounded-xl border-border/40 bg-gradient-to-br from-card to-card/80 shadow-sm">
                  <CardHeader className="border-b border-border/40 bg-secondary/20 px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <Settings className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold">Organization Settings</CardTitle>
                        <p className="text-sm text-muted-foreground">Manage your organization details</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Organization Name</label>
                        <div className="rounded-xl border border-border/40 bg-secondary/30 px-4 py-3 text-sm font-medium">
                          {organization.name}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Current Plan</label>
                        <div className="flex items-center gap-2 rounded-xl border border-border/40 bg-secondary/30 px-4 py-3">
                          <TrendingUp className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium capitalize">{organization.plan}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Description</label>
                      <div className="rounded-xl border border-border/40 bg-secondary/30 px-4 py-3 text-sm">
                        {organization.description}
                      </div>
                    </div>
                    <div className="flex gap-3 border-t border-border/40 pt-6">
                      <Button variant="outline" className="cursor-pointer bg-background/50 transition-all hover:bg-background">
                        Edit Details
                      </Button>
                      <Button variant="outline" className="cursor-pointer bg-transparent text-destructive transition-all hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30">
                        Delete Organization
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs> */}
        </div>
      </main>
  )
}

