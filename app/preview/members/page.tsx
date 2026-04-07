"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Users, Shield, Crown, UserCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";

// Mock data - replace with your real data
const mockMembers = [
  {
    id: "1",
    role: "OWNER" as const,
    volunteerRoles: ["LEAD_VOCALIST", "PIANIST"] as const[],
    joinedAt: new Date("2023-01-15"),
    user: {
      id: "u1",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@example.com",
      imageUrl: null,
    },
  },
  {
    id: "2",
    role: "ADMIN" as const,
    volunteerRoles: ["GUITARIST", "SOUND_TECH"] as const[],
    joinedAt: new Date("2023-03-22"),
    user: {
      id: "u2",
      firstName: "Michael",
      lastName: "Chen",
      email: "m.chen@example.com",
      imageUrl: null,
    },
  },
  {
    id: "3",
    role: "MEMBER" as const,
    volunteerRoles: ["DRUMMER"] as const[],
    joinedAt: new Date("2023-06-10"),
    user: {
      id: "u3",
      firstName: "Emily",
      lastName: "Davis",
      email: "emily.d@example.com",
      imageUrl: null,
    },
  },
  {
    id: "4",
    role: "MEMBER" as const,
    volunteerRoles: ["BGVS", "USHER"] as const[],
    joinedAt: new Date("2023-08-05"),
    user: {
      id: "u4",
      firstName: "James",
      lastName: "Wilson",
      email: "jwilson@example.com",
      imageUrl: null,
    },
  },
  {
    id: "5",
    role: "MEMBER" as const,
    volunteerRoles: ["GREETER"] as const[],
    joinedAt: new Date("2024-01-12"),
    user: {
      id: "u5",
      firstName: "Maria",
      lastName: "Garcia",
      email: "maria.g@example.com",
      imageUrl: null,
    },
  },
  {
    id: "6",
    role: "ADMIN" as const,
    volunteerRoles: ["BASSIST", "AUX_KEYS"] as const[],
    joinedAt: new Date("2023-04-18"),
    user: {
      id: "u6",
      firstName: "David",
      lastName: "Kim",
      email: "david.kim@example.com",
      imageUrl: null,
    },
  },
];

type OrgRole = "OWNER" | "ADMIN" | "MEMBER";
type VolunteerRole = "GUITARIST" | "PIANIST" | "AUX_KEYS" | "DRUMMER" | "LEAD_VOCALIST" | "BGVS" | "BASSIST" | "SOUND_TECH" | "USHER" | "GREETER";

const roleConfig = {
  OWNER: {
    label: "Owner",
    icon: Crown,
    className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  ADMIN: {
    label: "Admin",
    icon: Shield,
    className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  MEMBER: {
    label: "Member",
    icon: UserCircle,
    className: "bg-secondary text-secondary-foreground",
  },
};

const volunteerRoleNames: Record<VolunteerRole, string> = {
  GUITARIST: "Guitarist",
  PIANIST: "Pianist",
  AUX_KEYS: "Aux Keys",
  DRUMMER: "Drummer",
  LEAD_VOCALIST: "Lead Vocalist",
  BGVS: "BGVs",
  BASSIST: "Bassist",
  SOUND_TECH: "Sound Tech",
  USHER: "Usher",
  GREETER: "Greeter",
};

type RoleFilter = "all" | OrgRole;

export default function MembersPreviewPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");

  const members = mockMembers;

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch =
        searchQuery === "" ||
        `${member.user.firstName} ${member.user.lastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        member.user.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole =
        roleFilter === "all" || member.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [members, searchQuery, roleFilter]);

  const roleCounts = useMemo(() => {
    return {
      all: members.length,
      OWNER: members.filter((m) => m.role === "OWNER").length,
      ADMIN: members.filter((m) => m.role === "ADMIN").length,
      MEMBER: members.filter((m) => m.role === "MEMBER").length,
    };
  }, [members]);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-2xl font-semibold text-foreground">Members</h1>
        
        <div className="space-y-6">
          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </motion.div>

          {/* Role Filter Tabs */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap items-center gap-2"
          >
            <div className="flex rounded-lg border border-border bg-background p-1">
              <button
                onClick={() => setRoleFilter("all")}
                className={`relative rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                  roleFilter === "all"
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All
                <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-xs">
                  {roleCounts.all}
                </span>
              </button>
              {(["OWNER", "ADMIN", "MEMBER"] as OrgRole[]).map((role) => {
                const config = roleConfig[role];
                const Icon = config.icon;
                return (
                  <button
                    key={role}
                    onClick={() => setRoleFilter(role)}
                    className={`relative flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                      roleFilter === role
                        ? "bg-secondary text-secondary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {config.label}
                    {roleCounts[role] > 0 && (
                      <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-xs">
                        {roleCounts[role]}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Members List */}
          <AnimatePresence mode="wait">
            {filteredMembers.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center rounded-lg border border-border bg-card py-16"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  No members found
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {searchQuery
                    ? "Try adjusting your search"
                    : "No members match the selected filter"}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                {filteredMembers.map((member, index) => {
                  const config = roleConfig[member.role];
                  const Icon = config.icon;

                  return (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="group rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/50"
                    >
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <Avatar className="h-12 w-12">
                          {member.user.imageUrl ? (
                            <AvatarImage
                              src={member.user.imageUrl}
                              alt={`${member.user.firstName} ${member.user.lastName}`}
                            />
                          ) : null}
                          <AvatarFallback className="text-sm">
                            {getInitials(member.user.firstName, member.user.lastName)}
                          </AvatarFallback>
                        </Avatar>

                        {/* Member Info */}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="truncate font-medium text-foreground">
                              {member.user.firstName} {member.user.lastName}
                            </h3>
                            <Badge
                              variant="outline"
                              className={`flex items-center gap-1 ${config.className}`}
                            >
                              <Icon className="h-3 w-3" />
                              {config.label}
                            </Badge>
                          </div>
                          <p className="mt-0.5 truncate text-sm text-muted-foreground">
                            {member.user.email}
                          </p>

                          {/* Volunteer Roles */}
                          {member.volunteerRoles.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {member.volunteerRoles.map((role) => (
                                <span
                                  key={role}
                                  className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                                >
                                  {volunteerRoleNames[role]}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Join Date */}
                        <div className="hidden text-right sm:block">
                          <p className="text-xs text-muted-foreground">Joined</p>
                          <p className="text-sm font-medium text-foreground">
                            {formatDate(member.joinedAt)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Summary Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between border-t border-border pt-4 text-sm text-muted-foreground"
          >
            <p>
              Showing {filteredMembers.length} of {members.length} members
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
