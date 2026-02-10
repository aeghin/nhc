
import { VolunteerRole } from "@/generated/prisma/enums";

export const volunteerRoleConfig: Record<VolunteerRole, { label: string; icon: string }> = {
  [VolunteerRole.GUITARIST]:   { label: "Guitarist",   icon: "🎸" },
  [VolunteerRole.PIANIST]:     { label: "Pianist",      icon: "🎹" },
  [VolunteerRole.AUX_KEYS]:   { label: "Aux Keys",     icon: "🎹" },
  [VolunteerRole.DRUMMER]:    { label: "Drummer",       icon: "🥁" },
  [VolunteerRole.VOCALIST]:   { label: "Vocalist",      icon: "🎤" },
  [VolunteerRole.BASSIST]:    { label: "Bassist",       icon: "🎸" },
  [VolunteerRole.SOUND_TECH]: { label: "Sound Tech",    icon: "🎚️" },
  [VolunteerRole.USHER]:      { label: "Usher",         icon: "🚪" },
  [VolunteerRole.GREETER]:    { label: "Greeter",       icon: "👋" },
};