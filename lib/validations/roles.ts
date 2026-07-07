import { z } from "zod/v4";
import { OrgRole } from "@/generated/prisma/enums";

export const userRoleSchema = z.object({
    userId: z.uuid(),
    organizationId: z.uuid(),
    role: z.enum(OrgRole),
});

export const assignOwnerSchema = userRoleSchema.omit({ role: true });



export type UserRoleInput = z.infer<typeof userRoleSchema>;

export type AssignOwnerInput = z.infer<typeof assignOwnerSchema>;