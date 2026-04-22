import Link from "next/link";
import type { Metadata } from "next";
import { and, gte, lt, asc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ScheduleGrid } from "@/components/admin/ScheduleGrid";
import { BUSINESS_TZ } from "@/lib/time";

export const metadata: Metadata = {
  title: "Calendar — First Step Hoops Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ week?: string }>;
};

export default async function CalendarPage({ searchParams }: Props) {
  const { week } = await searchParams;

  // Week start is Sunday in the user's (server's) interpretation. We use the
  // server's local dates only to compute a range; ScheduleGrid runs on the
  // client and uses the browser's timezone for cell math.
  const weekStart = week
    ? startOfWeekFromDateParam(week)
    : startOfWeekLocal(new Date());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);

  const rows = await db
    .select()
    .from(schema.slots)
    .where(and(gte(schema.slots.startsAt, weekStart), lt(schema.slots.startsAt, weekEnd)))
    .orderBy(asc(schema.slots.startsAt))
    .limit(400);

  const slotsForGrid = rows.map((s) => ({
    id: s.id,
    startsAt: s.startsAt.toISOString(),
    durationMin: s.durationMin,
    location: s.location,
    status: s.status,
    isPrivate: s.isPrivate,
    capacity: s.capacity,
  }));

  return (
    <div className="px-10 py-10">
      <AdminPageHeader
        eyebrow="Schedule"
        title="Calendar"
        actions={
          <Link
            href="/admin/slots/new"
            className="h-11 px-5 inline-flex items-center justify-center bg-transparent border border-white/25 hover:border-white text-white rounded-btn text-[13px] font-semibold uppercase tracking-[0.06em] transition-colors"
            title="Create a slot with a custom duration or non-hour start"
          >
            Custom Slot
          </Link>
        }
      />

      <ScheduleGrid
        weekStartIso={weekStart.toISOString()}
        slots={slotsForGrid}
        businessTz={BUSINESS_TZ}
      />
    </div>
  );
}

function startOfWeekLocal(d: Date): Date {
  const out = new Date(d);
  out.setHours(0, 0, 0, 0);
  out.setDate(out.getDate() - out.getDay());
  return out;
}

function startOfWeekFromDateParam(param: string): Date {
  // Expect YYYY-MM-DD; fall back to "this week" if malformed
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(param);
  if (!match) return startOfWeekLocal(new Date());
  const [, y, m, d] = match;
  const dt = new Date(Number(y), Number(m) - 1, Number(d));
  return startOfWeekLocal(dt);
}
