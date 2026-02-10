import { z } from "zod";
import { VolunteerRole } from "@/generated/prisma/enums";

const orgInvitationSchema = z.object({
    email: z.email("Invalid email address").trim(),
    role: z.array(z.enum(VolunteerRole, "Invalid role selected")).min(1, "Select at least one role"),
});

export type OrgInvitationInput = z.infer<typeof orgInvitationSchema>;