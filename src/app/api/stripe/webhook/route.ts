import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import type Stripe from "stripe";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature") ?? "";

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 },
    );
  }

  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const bookingId = session.metadata?.bookingId;
        if (!bookingId) break;

        await db
          .update(schema.bookings)
          .set({
            stripePaymentIntentId:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : (session.payment_intent?.id ?? null),
          })
          .where(eq(schema.bookings.id, bookingId));
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        const bookingId = session.metadata?.bookingId;
        if (!bookingId) break;

        const [booking] = await db
          .select({ id: schema.bookings.id, slotId: schema.bookings.slotId })
          .from(schema.bookings)
          .where(eq(schema.bookings.id, bookingId))
          .limit(1);

        if (!booking) break;

        await releaseAbandonedBooking(booking.id, booking.slotId);
        break;
      }

      case "payment_intent.payment_failed": {
        const intent = event.data.object as Stripe.PaymentIntent;
        const bookingId = intent.metadata?.bookingId;
        if (!bookingId) break;

        const [booking] = await db
          .select({ id: schema.bookings.id, slotId: schema.bookings.slotId })
          .from(schema.bookings)
          .where(eq(schema.bookings.id, bookingId))
          .limit(1);

        if (!booking) break;

        await releaseAbandonedBooking(booking.id, booking.slotId);
        break;
      }

      default:
        // Ignore other events for now
        break;
    }
  } catch (err) {
    console.error("Stripe webhook handler error", err);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

/**
 * Delete the pending booking and reopen the slot. Called when Stripe tells us
 * the checkout was abandoned/expired/failed before payment.
 */
async function releaseAbandonedBooking(bookingId: string, slotId: string) {
  // Only release if the booking is still pending (no payment intent on file).
  // If a payment_intent has already been attached (race), leave it alone.
  const [latest] = await db
    .select({ paymentIntentId: schema.bookings.stripePaymentIntentId })
    .from(schema.bookings)
    .where(eq(schema.bookings.id, bookingId))
    .limit(1);

  if (!latest || latest.paymentIntentId) return;

  await db.delete(schema.bookings).where(eq(schema.bookings.id, bookingId));
  await db
    .update(schema.slots)
    .set({ status: "open" })
    .where(eq(schema.slots.id, slotId));
}
