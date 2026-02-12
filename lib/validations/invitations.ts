import { z } from "zod";
import { VolunteerRole } from "@/generated/prisma/enums";

export const orgInvitationSchema = z.object({
    email: z.email("Invalid email address").trim(),
    volunteerRoles: z.array(z.enum(VolunteerRole, "Invalid role selected")).min(1, "Select at least one role"),
    orgId: z.uuid("Invalid organization ID"),
});

export type OrgInvitationInput = z.infer<typeof orgInvitationSchema>;