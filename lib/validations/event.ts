import { z } from "zod/v4"
import { VolunteerRole } from "@/generated/prisma/enums"

export const createEventSchema = z.object({
  serviceTypeId: z.string().min(1, "Service type is required"),
  name: z.string().trim().min(1, "Event name is required").max(25, "Event name must be 25 characters or less"),
  description: z.string().trim().optional(),
  dateRange: z.object({
    from: z.date({ message: "Start date is required" }),
    to: z.date().optional(),
  }),
  dayTimes: z.record(
    z.string(),
    z.object({
      startTime: z.string().min(1, "Start time is required"),
      endTime: z.string().min(1, "End time is required"),
    })
  ),
  location: z.string().trim().min(1, "Location is required").max(20, "Location must be 20 characters or less"),
  rolesNeeded: z.array(z.enum(VolunteerRole)).min(1, "Select at least one role"),
  expiresAt: z.number().refine((v) => [3, 5, 7].includes(v)),
});

export type CreateEventFormData = z.infer<typeof createEventSchema>


export const createEventInputSchema = createEventSchema.extend({
  roleAssignments: z.record(z.enum(VolunteerRole), z.array(z.string()).default([])),
});

export type CreateEventInput = z.infer<typeof createEventInputSchema>;