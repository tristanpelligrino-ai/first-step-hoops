import { z } from "zod";

export const bookingDetailsSchema = z.object({
  slotId: z.string().uuid("Invalid slot"),
  parentName: z.string().trim().min(2, "Parent name is required").max(120),
  parentEmail: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid email address")
    .max(160),
  parentPhone: z
    .string()
    .trim()
    .min(7, "Phone number is required")
    .max(40),
  playerName: z.string().trim().min(1, "Player name is required").max(80),
  grade: z.enum(["3rd", "4th", "5th", "other"], {
    message: "Pick a grade",
  }),
  experienceNotes: z.string().trim().max(2000).optional().default(""),
  medicalNotes: z.string().trim().max(2000).optional().default(""),
});

export type BookingDetails = z.infer<typeof bookingDetailsSchema>;
