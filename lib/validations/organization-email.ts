import { z } from "zod/v4";


export const organizationEmailSchema = z.object({
    subject: z
    .string()
    .trim()
    .min(1, "Subject can't be empty")
    .max(120, "Subject is too long"),
  body: z
    .string()
    .trim()
    .min(1, "Message can't be empty")
    .max(5000, "Message is too long"),
});

export type OrganizationEmailInput = z.infer<typeof organizationEmailSchema>;