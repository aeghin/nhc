import { z } from "zod/v4";
import { SERVICE_TYPE_COLORS } from "@/lib/config/service-colors";

export const serviceTypeSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Service type name is required")
        .max(25, "Service type name must be 25 characters or less"),
    color: z.enum(SERVICE_TYPE_COLORS),
});

export type ServiceTypeInput = z.infer<typeof serviceTypeSchema>;

export const editServiceTypeSchema = serviceTypeSchema.extend({
    organizationId: z.uuid(),
    serviceTypeId: z.uuid(),
});

export type EditServiceTypeInput = z.infer<typeof editServiceTypeSchema>;
