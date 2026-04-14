import { z } from "zod/v4";
import { OrgRole } from "@/generated/prisma/enums";

export const userRoleSchema = z.object({
    userId: z.uuid(),
    organizationId: z.uuid(),
    role: z.enum(OrgRole),
});

