
import { VolunteerRole, OrgRole } from "@/generated/prisma/enums";
import { Crown, Shield, Users } from "lucide-react";

export const volunteerRoleConfig: Record<VolunteerRole, { label: string; icon: string }> = {
  [VolunteerRole.GUITARIST]:   { label: "Guitarist",   icon: "🎸" },
  [VolunteerRole.PIANIST]:     { label: "Pianist",      icon: "🎹" },
  [VolunteerRole.AUX_KEYS]:   { label: "Aux Keys",     icon: "🎹" },
  [VolunteerRole.DRUMMER]:    { label: "Drummer",       icon: "🥁" },
  [VolunteerRole.LEAD_VOCALIST]: { label: "Lead Vocalist", icon: "🎤" },
  [VolunteerRole.BGVS]:       { label: "Bgvs", icon: "🎤" },
  [VolunteerRole.BASSIST]:    { label: "Bassist",       icon: "🎸" },
  [VolunteerRole.SOUND_TECH]: { label: "Sound Tech",    icon: "🎚️" },
  [VolunteerRole.USHER]:      { label: "Usher",         icon: "🚪" },
  [VolunteerRole.GREETER]:    { label: "Greeter",       icon: "👋" },
};

export type RoleCategory = "band" | "vocals" | "production" | "hospitality";

export const roleCategoryConfig: Record<
  RoleCategory,
  { label: string; order: number }
> = {
  band: { label: "Band", order: 0 },
  vocals: { label: "Vocals", order: 1 },
  production: { label: "Production", order: 2 },
  hospitality: { label: "Hospitality", order: 3 },
};

export const roleToCategory: Record<VolunteerRole, RoleCategory> = {
  [VolunteerRole.PIANIST]: "band",
  [VolunteerRole.AUX_KEYS]: "band",
  [VolunteerRole.BASSIST]: "band",
  [VolunteerRole.GUITARIST]: "band",
  [VolunteerRole.DRUMMER]: "band",
  [VolunteerRole.LEAD_VOCALIST]: "vocals",
  [VolunteerRole.BGVS]: "vocals",
  [VolunteerRole.SOUND_TECH]: "production",
  [VolunteerRole.USHER]: "hospitality",
  [VolunteerRole.GREETER]: "hospitality",
};

export const getRoleConfig = (role: OrgRole) => {
  switch (role) {
      case OrgRole.OWNER:
        return { icon: Crown, label: "Owner", className: "bg-amber-500/10 text-amber-600 border-amber-500/20" }
      case OrgRole.ADMIN:
        return { icon: Shield, label: "Admin", className: "bg-primary/10 text-primary border-primary/20" }
      default:
        return { icon: Users, label: "Member", className: "bg-muted text-muted-foreground border-border" }
    };
};