import Link from "next/link";
import type { Metadata } from "next";
import { desc, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { formatDateLong, formatTimeShort } from "@/lib/time";

export const metadata: Metadata = {
  title: "Bookings — First Step Hoops Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const PILL_BASE =
  "inline-flex items-center px-2 py-[2px] text-[11px] uppercase tracking-[0.08em] font-mono border rounded-btn";

export default async function BookingsPage() {
  const rows = await db
    .select({
      id: schema.bookings.id,
      status: schema.bookings.status,
      paymentIntentId: schema.bookings.stripePaymentIntentId,
      startsAt: schema.slots.startsAt,
      location: schema.slots.location,
      playerName: schema.players.name,
      grade: schema.players.grade,
      parentName: schema.users.fullName,
      parentPhone: schema.users.phone,
    })
    .from(schema.bookings)
    .innerJoin(schema.slots, eq(schema.bookings.slotId, schema.slots.id))
    .innerJoin(schema.players, eq(schema.bookings.playerId, schema.players.id))
    .innerJoin(schema.users, eq(schema.bookings.userId, schema.users.id))
    .orderBy(desc(schema.slots.startsAt))
    .limit(300);

  return (
    <div className="px-10 py-10">
      <AdminPageHeader eyebrow="Manage" title="Bookings" />

      {rows.length === 0 ? (
        <div className="p-10 border border-white/10 bg-navy-2/40 text-white/70">
          No bookings yet. They&apos;ll show up here once a parent books a
          session.
        </div>
      ) : (
        <div className="border border-white/10 bg-navy-2/40 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white/[0.03] text-[11px] uppercase tracking-[0.12em] font-mono text-white/50">
              <tr>
                <th className="px-5 py-3 font-medium">Session</th>
                <th className="px-5 py-3 font-medium">Player</th>
                <th className="px-5 py-3 font-medium">Parent</th>
                <th className="px-5 py-3 font-medium">Location</th>
                <th className="px-5 py-3 font-medium">Payment</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <tr
                  key={b.id}
                  className="border-t border-white/5 hover:bg-white/[0.02]"
                >
                  <td className="px-5 py-3 text-[14px]">
                    {formatDateLong(b.startsAt)}
                    <span className="text-white/50">
                      {" "}
                      · {formatTimeShort(b.startsAt)}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[14px]">
                    {b.playerName}
                    <span className="text-white/50 text-[12px]">
                      {" "}
                      · {b.grade === "other" ? "Other" : b.grade}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[14px] text-white/80">
                    {b.parentName}
                    <div className="text-[12px] text-white/50">
                      {b.parentPhone}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[13px] text-white/70">
                    {b.location}
                  </td>
                  <td className="px-5 py-3">
                    <PaymentPill paid={!!b.paymentIntentId} />
                  </td>
                  <td className="px-5 py-3">
                    <BookingStatusPill status={b.status} />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`/admin/bookings/${b.id}`}
                      className="text-blue-soft hover:text-blue text-[13px] font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function PaymentPill({ paid }: { paid: boolean }) {
  return paid ? (
    <span className={`${PILL_BASE} bg-blue/20 text-blue-soft border-blue/40`}>
      Paid
    </span>
  ) : (
    <span className={`${PILL_BASE} bg-white/10 text-white/50 border-white/20`}>
      Pending
    </span>
  );
}

function BookingStatusPill({
  status,
}: {
  status: "scheduled" | "delivered" | "no_show" | "canceled";
}) {
  const map = {
    scheduled: { label: "Scheduled", cls: "bg-blue/20 text-blue-soft border-blue/40" },
    delivered: { label: "Delivered", cls: "bg-blue text-white border-blue" },
    no_show: { label: "No-show", cls: "bg-orange/20 text-orange border-orange/40" },
    canceled: { label: "Canceled", cls: "bg-white/10 text-white/50 border-white/20" },
  } as const;
  const s = map[status];
  return <span className={`${PILL_BASE} ${s.cls}`}>{s.label}</span>;
}
