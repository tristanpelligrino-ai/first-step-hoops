import { z } from "zod";

export const waiverVersionInputSchema = z.object({
  version: z
    .string()
    .trim()
    .min(1, "Version label is required")
    .max(40, "Version label is too long"),
  bodyMd: z
    .string()
    .trim()
    .min(50, "Waiver text looks too short — paste the full waiver"),
});

export type WaiverVersionInput = z.infer<typeof waiverVersionInputSchema>;
