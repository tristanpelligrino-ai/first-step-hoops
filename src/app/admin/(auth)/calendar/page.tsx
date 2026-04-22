import Link from "next/link";
import type { Metadata } from "next";
import { and, gte, asc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { formatDateLong, formatTimeShort, formatDayKey, BUSINESS_TZ } from "@/lib/time";

export const metadata: Metadata = {
  title: "Calendar — First Step Hoops Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const now = new Date();
  // Look back 1 day so freshly-passed slots still show briefly
  const windowStart = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const upcoming = await db
    .select()
    .from(schema.slots)
    .where(and(gte(schema.slots.startsAt, windowStart)))
    .orderBy(asc(schema.slots.startsAt))
    .limit(300);

  // Group by day key (in business TZ)
  const byDay = new Map<string, typeof upcoming>();
  for (const s of upcoming) {
    const key = formatDayKey(s.startsAt);
    const bucket = byDay.get(key) ?? [];
    bucket.push(s);
    byDay.set(key, bucket);
  }

  const orderedDays = Array.from(byDay.entries());

  return (
    <div className="px-10 py-10">
      <AdminPageHeader
        eyebrow="Calendar"
        title="Upcoming Sessions"
        actions={
          <Link
            href="/admin/slots/new"
            className="h-11 px-5 inline-flex items-center justify-center bg-blue hover:bg-blue-soft text-white rounded-btn text-[13px] font-semibold uppercase tracking-[0.06em] transition-colors"
          >
            + New Slot
          </Link>
        }
      />

      <p className="mb-8 text-[12px] font-mono uppercase tracking-[0.08em] text-white/50">
        All times shown in {BUSINESS_TZ.replace("_", " ")}
      </p>

      {orderedDays.length === 0 ? (
        <div className="p-10 border border-white/10 bg-navy-2/40 text-white/70">
          Nothing scheduled. Open up some slots and availability will show here.
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {orderedDays.map(([dayKey, slots]) => (
            <section key={dayKey}>
              <div className="flex items-baseline gap-4 mb-3">
                <h2 className="font-display text-[28px] leading-none">
                  {formatDateLong(new Date(slots[0].startsAt))}
                </h2>
                <span className="text-[12px] font-mono uppercase tracking-[0.08em] text-white/50">
                  {slots.length} slot{slots.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="border border-white/10 bg-navy-2/40">
                {slots.map((s, i) => (
                  <Link
                    key={s.id}
                    href={`/admin/slots/${s.id}`}
                    className={`flex items-center gap-6 px-5 py-4 hover:bg-white/[0.03] transition-colors ${i !== 0 ? "border-t border-white/5" : ""}`}
                  >
                    <div className="font-display text-[24px] leading-none min-w-[120px]">
                      {formatTimeShort(s.startsAt)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] text-white truncate">{s.location}</div>
                      <div className="text-[12px] font-mono uppercase tracking-[0.08em] text-white/50 mt-1">
                        {s.durationMin} min · {s.isPrivate ? "Private" : "Public"}
                        {s.capacity > 1 ? ` · cap ${s.capacity}` : ""}
                      </div>
                    </div>
                    <div>
                      <StatusPill status={s.status} />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: "open" | "booked" | "canceled" }) {
  const colors = {
    open: "bg-blue/20 text-blue-soft border-blue/40",
    booked: "bg-orange/20 text-orange border-orange/40",
    canceled: "bg-white/10 text-white/50 border-white/20",
  } as const;
  return (
    <span
      className={`inline-flex items-center px-2 py-[2px] text-[11px] uppercase tracking-[0.08em] font-mono border rounded-btn ${colors[status]}`}
    >
      {status}
    </span>
  );
}
