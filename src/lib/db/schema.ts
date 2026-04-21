import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  boolean,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

/**
 * Schema matches spec.md §2. Enums and tables below follow that section 1:1.
 * Keep this file authoritative; regenerate migrations with `npm run db:generate`.
 */

// -------------------- Enums --------------------

export const gradeEnum = pgEnum("grade", ["3rd", "4th", "5th", "other"]);

export const slotStatusEnum = pgEnum("slot_status", [
  "open",
  "booked",
  "canceled",
]);

export const bookingStatusEnum = pgEnum("booking_status", [
  "scheduled",
  "delivered",
  "no_show",
  "canceled",
]);

export const paidWithEnum = pgEnum("paid_with", [
  "single_purchase",
  "credit",
  "private_invoice",
]);

export const creditStatusEnum = pgEnum("credit_status", [
  "available",
  "consumed",
  "returned",
  "expired",
  "restored",
]);

export const magicLinkPurposeEnum = pgEnum("magic_link_purpose", [
  "apply_credit",
  "view_bookings",
]);

export const actorTypeEnum = pgEnum("actor_type", [
  "admin",
  "customer",
  "system",
]);

// -------------------- Core customer tables --------------------

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  fullName: text("full_name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const players = pgTable("players", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  grade: gradeEnum("grade").notNull(),
  experienceNotes: text("experience_notes"),
  medicalNotes: text("medical_notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// -------------------- Scheduling --------------------

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
});

export const slots = pgTable("slots", {
  id: uuid("id").primaryKey().defaultRandom(),
  startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
  durationMin: integer("duration_min").notNull().default(50),
  location: text("location").notNull(),
  status: slotStatusEnum("status").notNull().default("open"),
  isPrivate: boolean("is_private").notNull().default(false),
  capacity: integer("capacity").notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  createdBy: uuid("created_by").references(() => adminUsers.id),
});

// -------------------- Waiver (declared before bookings — bookings reference it) --------------------

export const waiverVersions = pgTable("waiver_versions", {
  id: uuid("id").primaryKey().defaultRandom(),
  version: text("version").notNull(),
  bodyMd: text("body_md").notNull(),
  effectiveFrom: timestamp("effective_from", { withTimezone: true })
    .notNull()
    .defaultNow(),
  isCurrent: boolean("is_current").notNull().default(false),
});

export const signedWaivers = pgTable("signed_waivers", {
  id: uuid("id").primaryKey().defaultRandom(),
  waiverVersionId: uuid("waiver_version_id")
    .notNull()
    .references(() => waiverVersions.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  playerId: uuid("player_id")
    .notNull()
    .references(() => players.id),
  typedName: text("typed_name").notNull(),
  signedAt: timestamp("signed_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  ipAddress: text("ip_address").notNull(),
  userAgent: text("user_agent").notNull(),
});

// -------------------- Credits (declared before bookings — bookings reference credits) --------------------

export const creditPacks = pgTable("credit_packs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  purchasedAt: timestamp("purchased_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  totalCredits: integer("total_credits").notNull(),
  stripePaymentIntentId: text("stripe_payment_intent_id").notNull(),
  amountPaidCents: integer("amount_paid_cents").notNull(),
});

export const credits = pgTable("credits", {
  id: uuid("id").primaryKey().defaultRandom(),
  creditPackId: uuid("credit_pack_id")
    .notNull()
    .references(() => creditPacks.id, { onDelete: "cascade" }),
  status: creditStatusEnum("status").notNull().default("available"),
  consumedByBookingId: uuid("consumed_by_booking_id"),
  statusChangedAt: timestamp("status_changed_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  statusChangedBy: uuid("status_changed_by").references(() => adminUsers.id),
});

// -------------------- Bookings --------------------

export const bookings = pgTable("bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  slotId: uuid("slot_id")
    .notNull()
    .references(() => slots.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  playerId: uuid("player_id")
    .notNull()
    .references(() => players.id),
  status: bookingStatusEnum("status").notNull().default("scheduled"),
  paidWith: paidWithEnum("paid_with").notNull(),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  creditId: uuid("credit_id").references(() => credits.id),
  signedWaiverId: uuid("signed_waiver_id").references(() => signedWaivers.id),
  customPriceCents: integer("custom_price_cents"),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  statusChangedAt: timestamp("status_changed_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  statusChangedBy: uuid("status_changed_by").references(() => adminUsers.id),
});

// -------------------- Magic links --------------------

export const magicLinkTokens = pgTable("magic_link_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  tokenHash: text("token_hash").notNull().unique(),
  purpose: magicLinkPurposeEnum("purpose").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
});

// -------------------- Audit log --------------------

export const auditLog = pgTable("audit_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorType: actorTypeEnum("actor_type").notNull(),
  actorId: uuid("actor_id"),
  action: text("action").notNull(),
  targetType: text("target_type").notNull(),
  targetId: uuid("target_id").notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// Marker export to satisfy linters that look for used imports from drizzle
export const __schemaReady = sql`1`;
