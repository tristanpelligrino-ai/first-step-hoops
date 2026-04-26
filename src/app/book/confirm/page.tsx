import Link from "next/link";
import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import { formatDateLong, formatTimeShort, BUSINESS_TZ } from "@/lib/time";

export const metadata: Metadata = {
  title: "Booking Confirmed — First Step Hoops",
};

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function ConfirmPage({ searchParams }: Props) {
  const { session_id } = await searchParams;

  let booking: {
    when: string;
    time: string;
    location: string;
    durationMin: number;
    playerName: string;
  } | null = null;
  let pendingMsg: string | null = null;

  if (session_id) {
    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(session_id);
      const bookingId = session.metadata?.bookingId;

      if (bookingId) {
        const [row] = await db
          .select({
            slotStartsAt: schema.slots.startsAt,
            slotLocation: schema.slots.location,
            slotDuration: schema.slots.durationMin,
            playerName: schema.players.name,
            paymentIntentId: schema.bookings.stripePaymentIntentId,
          })
          .from(schema.bookings)
          .innerJoin(schema.slots, eq(schema.slots.id, schema.bookings.slotId))
          .innerJoin(schema.players, eq(schema.players.id, schema.bookings.playerId))
          .where(eq(schema.bookings.id, bookingId))
          .limit(1);

        if (row) {
          if (!row.paymentIntentId) {
            pendingMsg =
              "Payment is processing — your booking will be confirmed in a moment. You can close this page; we'll text + email you when it's confirmed.";
          }
          booking = {
            when: formatDateLong(row.slotStartsAt),
            time: formatTimeShort(row.slotStartsAt),
            location: row.slotLocation,
            durationMin: row.slotDuration,
            playerName: row.playerName,
          };
        }
      }
    } catch {
      // Fall through to generic message
    }
  }

  return (
    <div className="container-fsh py-20">
      <div className="mono-eyebrow text-blue mb-3">
        <span className="inline-block w-6 h-px bg-blue mr-[10px] align-middle" />
        Confirmed
      </div>
      <h1
        className="display m-0 mb-6"
        style={{ fontSize: "clamp(48px, 7vw, 96px)" }}
      >
        You&apos;re Booked.
      </h1>

      {pendingMsg ? (
        <p className="mb-8 text-orange text-[14px] font-mono max-w-[60ch]">
          {pendingMsg}
        </p>
      ) : null}

      {booking ? (
        <div className="p-6 border border-blue/30 bg-blue/[0.06] max-w-[640px] mb-10">
          <div className="mono-eyebrow text-blue-soft mb-2">{booking.playerName}</div>
          <div className="text-[20px] font-display leading-tight">
            {booking.when} at {booking.time}
          </div>
          <div className="text-[14px] text-white/70 mt-1">{booking.location}</div>
          <div className="text-[12px] font-mono uppercase tracking-[0.08em] text-white/50 mt-2">
            {booking.durationMin} min · {BUSINESS_TZ.replace("_", " ")}
          </div>
        </div>
      ) : (
        <p className="mb-10 text-white/70 text-[16px] max-w-[60ch]">
          Your payment was successful. We&apos;ll send confirmation details to
          your email shortly.
        </p>
      )}

      <div className="text-white/70 text-[15px] max-w-[60ch] leading-[1.6]">
        <p className="mb-4">
          <strong className="text-white">What&apos;s next:</strong>
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>You&apos;ll get a confirmation by email and SMS shortly.</li>
          <li>
            Need to reschedule or have a question? Just text us back when you
            get the confirmation message.
          </li>
          <li>Show up 5 minutes early for your first session.</li>
        </ul>
      </div>

      <div className="mt-12">
        <Link
          href="/"
          className="h-11 px-5 inline-flex items-center justify-center bg-transparent border border-white/25 hover:border-white text-white rounded-btn text-[13px] font-semibold uppercase tracking-[0.06em] transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
