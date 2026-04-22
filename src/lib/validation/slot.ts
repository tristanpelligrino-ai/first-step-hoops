import { z } from "zod";

export const slotInputSchema = z.object({
  startsAt: z
    .string()
    .min(1, "Start time is required")
    .refine((s) => !Number.isNaN(Date.parse(s)), "Invalid date/time"),
  durationMin: z.coerce.number().int().min(1, "Must be at least 1 minute").max(480),
  location: z.string().trim().min(1, "Location is required").max(200),
  isPrivate: z
    .union([z.literal("on"), z.literal("true"), z.literal("")])
    .optional()
    .transform((v) => v === "on" || v === "true"),
  capacity: z.coerce.number().int().min(1).max(20).default(1),
});

export type SlotInput = z.infer<typeof slotInputSchema>;
