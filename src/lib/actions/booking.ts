"use server";

import { and, desc, eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { db, schema } from "@/lib/db";
import { getStripe, PRICES } from "@/lib/stripe";
import { bookingDetailsSchema } from "@/lib/validation/booking";
import { formatDateLong, formatTimeShort } from "@/lib/time";

export async function startSingleSessionCheckoutAction(formData: FormData) {
  const parsed = bookingDetailsSchema.safeParse({
    slotId: formData.get("slotId"),
    parentName: formData.get("parentName"),
    parentEmail: formData.get("parentEmail"),
    parentPhone: formData.get("parentPhone"),
    playerName: formData.get("playerName"),
    grade: formData.get("grade"),
    experienceNotes: formData.get("experienceNotes") ?? "",
    medicalNotes: formData.get("medicalNotes") ?? "",
    waiverTypedName: formData.get("waiverTypedName") ?? "",
  });

  if (!parsed.success) {
    const slotId = String(formData.get("slotId") ?? "");
    const msg = parsed.error.issues[0]?.message ?? "Invalid form data";
    redirect(
      `/book/details?slot=${encodeURIComponent(slotId)}&error=${encodeURIComponent(msg)}`,
    );
  }

  const data = parsed.data;

  // The liability waiver must be explicitly agreed to before we take payment.
  if (formData.get("waiverAccepted") !== "on") {
    redirect(
      `/book/details?slot=${encodeURIComponent(data.slotId)}&error=${encodeURIComponent("Please agree to the liability waiver to continue.")}`,
    );
  }

  // Verify slot is bookable
  const [slot] = await db
    .select()
    .from(schema.slots)
    .where(eq(schema.slots.id, data.slotId))
    .limit(1);

  if (!slot) {
    redirect("/book/slots?error=not-found");
  }

  // Private slots are reachable only via their direct share link (group /
  // clinic sessions), so we allow them here — the slot id is the access token.
  if (slot.status !== "open" || slot.startsAt < new Date()) {
    redirect("/book/slots?error=unavailable");
  }

  if (slot.seatsTaken >= slot.capacity) {
    redirect("/book/slots?error=taken");
  }

  // A multi-seat slot is a group session: several players book the same slot
  // and each pays the (typically discounted) per-seat price.
  const isGroup = slot.capacity > 1;

  // A published waiver must exist to bind the parent's signature to.
  const [currentWaiver] = await db
    .select({ id: schema.waiverVersions.id })
    .from(schema.waiverVersions)
    .where(eq(schema.waiverVersions.isCurrent, true))
    .orderBy(desc(schema.waiverVersions.effectiveFrom))
    .limit(1);

  if (!currentWaiver) {
    redirect(
      `/book/details?slot=${encodeURIComponent(data.slotId)}&error=${encodeURIComponent("Booking is briefly unavailable. Please try again shortly.")}`,
    );
  }

  // Atomic claim. Group slots increment the seat counter (and only succeed
  // while a seat is free), leaving status 'open' so other players can still
  // book. Standard single slots flip 'open' -> 'booked' as before.
  const claimed = isGroup
    ? await db
        .update(schema.slots)
        .set({ seatsTaken: sql`${schema.slots.seatsTaken} + 1` })
        .where(
          and(
            eq(schema.slots.id, data.slotId),
            eq(schema.slots.status, "open"),
            sql`${schema.slots.seatsTaken} < ${schema.slots.capacity}`,
          ),
        )
        .returning({ id: schema.slots.id })
    : await db
        .update(schema.slots)
        .set({ status: "booked" })
        .where(
          and(eq(schema.slots.id, data.slotId), eq(schema.slots.status, "open")),
        )
        .returning({ id: schema.slots.id });

  if (claimed.length === 0) {
    redirect("/book/slots?error=taken");
  }

  // Upsert user by email (lowercase already from zod)
  const [existing] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, data.parentEmail))
    .limit(1);

  let userId: string;
  if (existing) {
    userId = existing.id;
    // Refresh phone + name in case parent updated their contact info
    await db
      .update(schema.users)
      .set({ phone: data.parentPhone, fullName: data.parentName })
      .where(eq(schema.users.id, existing.id));
  } else {
    const [created] = await db
      .insert(schema.users)
      .values({
        email: data.parentEmail,
        phone: data.parentPhone,
        fullName: data.parentName,
      })
      .returning({ id: schema.users.id });
    userId = created.id;
  }

  // Create player record (one per booking — same parent can have multiple kids
  // booked across sessions; we don't try to dedupe here)
  const [player] = await db
    .insert(schema.players)
    .values({
      userId,
      name: data.playerName,
      grade: data.grade,
      experienceNotes: data.experienceNotes || null,
      medicalNotes: data.medicalNotes || null,
    })
    .returning({ id: schema.players.id });

  // Record the signed liability waiver — electronic signature + audit metadata.
  const requestHeaders = await headers();
  const ipAddress =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "unknown";
  const userAgent = requestHeaders.get("user-agent") || "unknown";

  const [signedWaiver] = await db
    .insert(schema.signedWaivers)
    .values({
      waiverVersionId: currentWaiver.id,
      userId,
      playerId: player.id,
      typedName: data.waiverTypedName,
      ipAddress,
      userAgent,
    })
    .returning({ id: schema.signedWaivers.id });

  // Per-seat price: the slot's override (discounted group price) or the
  // standard single-session price.
  const unitAmount = slot.priceCentsOverride ?? PRICES.single;

  // Create pending booking — payment_intent stays null until webhook confirms
  const [booking] = await db
    .insert(schema.bookings)
    .values({
      slotId: data.slotId,
      userId,
      playerId: player.id,
      status: "scheduled",
      paidWith: "single_purchase",
      stripePaymentIntentId: null,
      signedWaiverId: signedWaiver.id,
      customPriceCents: slot.priceCentsOverride ?? null,
    })
    .returning({ id: schema.bookings.id });

  // Create Stripe Checkout Session — 30 minute expiry so abandoned checkouts
  // release the slot via the checkout.session.expired webhook.
  const stripe = getStripe();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: data.parentEmail,
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: unitAmount,
          product_data: {
            name: isGroup
              ? "First Step Hoops — Group Session"
              : "First Step Hoops — Single Session",
            description: `${formatDateLong(slot.startsAt)} at ${formatTimeShort(slot.startsAt)} · ${slot.location}`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      bookingId: booking.id,
      plan: isGroup ? "group" : "single",
    },
    payment_intent_data: {
      metadata: {
        bookingId: booking.id,
        plan: isGroup ? "group" : "single",
      },
    },
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    success_url: `${baseUrl}/book/confirm?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/book/slots`,
  });

  if (!session.url) {
    // Should not happen in practice — Stripe always returns a URL for hosted Checkout
    redirect("/book/slots?error=stripe");
  }

  redirect(session.url);
}
