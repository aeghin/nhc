import { z } from "zod";

export const organizationSchema = z.object({
  name: z.string().min(3, "Organization name must be at least 3 characters long").max(20, "Organization name must be at most 20 characters long").trim(),
  description: z.string().max(100, "Description must be at most 100 characters long").trim(),
});

export type OrganizationInput = z.infer<typeof organizationSchema>;

