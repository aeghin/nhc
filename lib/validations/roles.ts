import { z } from "zod/v4";
import { OrgRole, VolunteerRole } from "@/generated/prisma/enums";

export const userRoleSchema = z.object({
    userId: z.uuid(),
    organizationId: z.uuid(),
    role: z.enum(OrgRole),
});

export type UserRoleInput = z.infer<typeof userRoleSchema>;


export const volunteerRoleChangeSchema = z.object({
    userId: z.uuid(),
    organizationId: z.uuid(),
    volunteerRoles: z.array(z.enum(VolunteerRole, "Invalid Role Selected")).min(1, "At least 1 role must be selected")
});

export type volunteerRoleChangeInput = z.infer<typeof volunteerRoleChangeSchema>;