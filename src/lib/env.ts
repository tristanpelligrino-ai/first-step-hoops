import { z } from "zod";

/**
 * Validate environment variables at import time.
 * Variables needed only in specific phases are optional here; code paths that use them
 * should guard and fail loudly if missing at runtime.
 */
const envSchema = z.object({
  // Database (Phase 0+, but only required once we run migrations)
  DATABASE_URL: z.string().url().optional(),

  // Stripe (Phase 4+)
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),

  // Resend (Phase 8)
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().email().optional(),

  // Twilio (Phase 8)
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_PHONE_NUMBER: z.string().optional(),

  // Auth secrets (Phase 2+, Phase 6+)
  ADMIN_SESSION_SECRET: z.string().min(32).optional(),
  MAGIC_LINK_SECRET: z.string().min(32).optional(),

  // App
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  CRON_SECRET: z.string().optional(),
});

export const env = envSchema.parse(process.env);
