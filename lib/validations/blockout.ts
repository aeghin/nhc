import { z } from "zod/v4";

const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_BLOCKOUT_DAYS = 366;

export const createBlockoutSchema = z
  .object({
    organizationId: z.uuid(),
    startDate: z.iso.date(),
    endDate: z.iso.date(),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be on or after the start date",
  })
  .refine(
    (data) =>
      new Date(`${data.endDate}T00:00:00Z`).getTime() -
        new Date(`${data.startDate}T00:00:00Z`).getTime() <=
      MAX_BLOCKOUT_DAYS * DAY_MS,
    { message: "Blockouts can't be longer than a year" },
  );

export type CreateBlockoutInput = z.infer<typeof createBlockoutSchema>;
