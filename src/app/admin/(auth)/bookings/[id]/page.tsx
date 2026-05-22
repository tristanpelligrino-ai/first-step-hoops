import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { formatDateLong, formatTimeShort } from "@/lib/time";
import { PRICES } from "@/lib/stripe";
import { updateBookingStatusAction } from "@/lib/actions/bookings";

export const metadata: Metadata = {
  title: "Booking — First Step Hoops Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ updated?: string }>;
};

const STATUS_OPTIONS = [
  { value: "scheduled", label: "Scheduled" },
  { value: "delivered", label: "Delivered" },
  { value: "no_show", label: "No-show" },
  { value: "canceled", label: "Canceled" },
] as const;

export default async function BookingDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { updated } = await searchParams;

  const [b] = await db
    .select({
      id: schema.bookings.id,
      status: schema.bookings.status,
      paidWith: schema.bookings.paidWith,
      paymentIntentId: schema.bookings.stripePaymentIntentId,
      customPriceCents: schema.bookings.customPriceCents,
      createdAt: schema.bookings.createdAt,
      startsAt: schema.slots.startsAt,
      location: schema.slots.location,
      durationMin: schema.slots.durationMin,
      playerName: schema.players.name,
      grade: schema.players.grade,
      experienceNotes: schema.players.experienceNotes,
      medicalNotes: schema.players.medicalNotes,
      parentName: schema.users.fullName,
      parentEmail: schema.users.email,
      parentPhone: schema.users.phone,
      waiverTypedName: schema.signedWaivers.typedName,
      waiverSignedAt: schema.signedWaivers.signedAt,
      waiverVersion: schema.waiverVersions.version,
    })
    .from(schema.bookings)
    .innerJoin(schema.slots, eq(schema.bookings.slotId, schema.slots.id))
    .innerJoin(schema.players, eq(schema.bookings.playerId, schema.players.id))
    .innerJoin(schema.users, eq(schema.bookings.userId, schema.users.id))
    .leftJoin(
      schema.signedWaivers,
      eq(schema.bookings.signedWaiverId, schema.signedWaivers.id),
    )
    .leftJoin(
      schema.waiverVersions,
      eq(schema.signedWaivers.waiverVersionId, schema.waiverVersions.id),
    )
    .where(eq(schema.bookings.id, id))
    .limit(1);

  if (!b) notFound();

  const paid = !!b.paymentIntentId;
  const amountCents = b.customPriceCents ?? PRICES.single;

  return (
    <div className="px-10 py-10 max-w-[860px]">
      <AdminPageHeader
        eyebrow="Booking"
        title={b.playerName}
        actions={
          <Link
            href="/admin/bookings"
            className="h-11 px-5 inline-flex items-center justify-center bg-transparent border border-white/25 hover:border-white text-white rounded-btn text-[13px] font-semibold uppercase tracking-[0.06em] transition-colors"
          >
            All bookings
          </Link>
        }
      />

      {updated ? (
        <p className="mb-6 p-3 border border-blue/40 bg-blue/[0.08] text-blue-soft text-[13px] font-mono">
          Booking status updated.
        </p>
      ) : null}

      <div className="flex flex-col gap-6">
        <Card title="Session">
          <Row label="Date">{formatDateLong(b.startsAt)}</Row>
          <Row label="Time">
            {formatTimeShort(b.startsAt)} · {b.durationMin} min
          </Row>
          <Row label="Location">{b.location}</Row>
        </Card>

        <Card title="Player">
          <Row label="Name">{b.playerName}</Row>
          <Row label="Grade">
            {b.grade === "other" ? "Other" : `${b.grade} grade`}
          </Row>
          <Row label="Experience">{b.experienceNotes?.trim() || "—"}</Row>
        </Card>

        {b.medicalNotes?.trim() ? (
          <div className="p-4 border border-orange/40 bg-orange/[0.08] rounded-btn">
            <div className="mono-eyebrow text-orange mb-2">Medical notes</div>
            <div className="text-[14px] text-white/90 whitespace-pre-wrap leading-relaxed">
              {b.medicalNotes}
            </div>
          </div>
        ) : (
          <Card title="Medical notes">
            <p className="text-[14px] text-white/50">None provided.</p>
          </Card>
        )}

        <Card title="Parent / guardian">
          <Row label="Name">{b.parentName}</Row>
          <Row label="Email">
            <a
              href={`mailto:${b.parentEmail}`}
              className="text-blue-soft hover:text-blue"
            >
              {b.parentEmail}
            </a>
          </Row>
          <Row label="Phone">
            <a
              href={`tel:${b.parentPhone}`}
              className="text-blue-soft hover:text-blue"
            >
              {b.parentPhone}
            </a>
          </Row>
        </Card>

        <Card title="Payment & waiver">
          <Row label="Payment">
            {paid
              ? `Paid · $${(amountCents / 100).toFixed(2)}`
              : "Pending payment"}
          </Row>
          <Row label="Booked">{formatDateLong(b.createdAt)}</Row>
          <Row label="Waiver">
            {b.waiverTypedName
              ? `Signed by ${b.waiverTypedName}` +
                (b.waiverVersion ? ` (${b.waiverVersion})` : "") +
                (b.waiverSignedAt
                  ? ` on ${formatDateLong(b.waiverSignedAt)}`
                  : "")
              : "No waiver on file"}
          </Row>
        </Card>

        <div className="p-5 border border-white/15 bg-navy-2/40 rounded-btn">
          <div className="mono-eyebrow text-white/60 mb-3">Session status</div>
          <form
            action={updateBookingStatusAction}
            className="flex flex-wrap gap-2"
          >
            <input type="hidden" name="bookingId" value={b.id} />
            {STATUS_OPTIONS.map((opt) => {
              const active = opt.value === b.status;
              return (
                <button
                  key={opt.value}
                  type="submit"
                  name="status"
                  value={opt.value}
                  disabled={active}
                  className={`h-10 px-4 rounded-btn text-[13px] font-semibold uppercase tracking-[0.05em] border transition-colors ${
                    active
                      ? "bg-blue text-white border-blue cursor-default"
                      : "bg-transparent border-white/25 text-white/80 hover:border-white hover:text-white"
                  }`}
                >
                  {active ? `✓ ${opt.label}` : opt.label}
                </button>
              );
            })}
          </form>
          <p className="mt-3 text-[12px] text-white/40">
            Refunds and reschedules aren&apos;t in the panel yet — handle refunds
            in Stripe and reschedules by email for now.
          </p>
        </div>
      </div>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-5 border border-white/15 bg-navy-2/40 rounded-btn">
      <div className="mono-eyebrow text-white/60 mb-3">{title}</div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 text-[14px]">
      <span className="w-[120px] shrink-0 text-white/50">{label}</span>
      <span className="text-white/90 min-w-0">{children}</span>
    </div>
  );
}
