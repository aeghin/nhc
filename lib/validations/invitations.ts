import { z } from "zod";
import { VolunteerRole } from "@/generated/prisma/enums";

const orgInvitationSchema = z.object({
    email: z.email("Invalid email address").trim,
    role: z.enum(VolunteerRole, "Invalid role selected"),
})

export type OrgInvitationInput = z.infer<typeof orgInvitationSchema>;