import type { Metadata } from "next";
import Link from "next/link";
import { and, eq, gte, lte, ne, countDistinct } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { getAdminSession } from "@/lib/auth/admin-session";
import { formatDayKey } from "@/lib/time";

export const metadata: Metadata = {
  title: "Dashboard — First Step Hoops Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getAdminSession();

  const now = new Date();
  // Bound the scan to the days we care about (yesterday … +8 days) so the
  // dashboard stays cheap; we bucket precisely in the business timezone below.
  const windowStart = new Date(now.getTime() - 2 * 86_400_000);
  const windowEnd = new Date(now.getTime() + 9 * 86_400_000);

  const upcoming = await db
    .select({
      startsAt: schema.slots.startsAt,
      status: schema.bookings.status,
    })
    .from(schema.bookings)
    .innerJoin(schema.slots, eq(schema.bookings.slotId, schema.slots.id))
    .where(
      and(
        gte(schema.slots.startsAt, windowStart),
        lte(schema.slots.startsAt, windowEnd),
      ),
    );

  const todayKey = formatDayKey(now);
  // Day keys for today + the next 6 days, in business time.
  const weekKeys = new Set(
    Array.from({ length: 7 }, (_, i) => addDaysToKey(todayKey, i)),
  );

  const sessionsToday = upcoming.filter(
    (b) => b.status !== "canceled" && formatDayKey(b.startsAt) === todayKey,
  ).length;

  const scheduledThisWeek = upcoming.filter(
    (b) => b.status === "scheduled" && weekKeys.has(formatDayKey(b.startsAt)),
  ).length;

  // Distinct parents with at least one booking that wasn't canceled.
  const [{ value: activeCustomers }] = await db
    .select({ value: countDistinct(schema.bookings.userId) })
    .from(schema.bookings)
    .where(ne(schema.bookings.status, "canceled"));

  return (
    <div className="px-10 py-10">
      <div className="mono-eyebrow text-blue mb-3">
        <span className="inline-block w-6 h-px bg-blue mr-[10px] align-middle" />
        Dashboard
      </div>
      <h1
        className="display m-0 mb-8"
        style={{ fontSize: "clamp(48px, 6vw, 80px)" }}
      >
        Welcome back, {session.username}.
      </h1>

      <div className="grid grid-cols-3 gap-5 max-w-[900px] max-[860px]:grid-cols-1">
        <StatCard
          label="Sessions today"
          value={sessionsToday}
          href="/admin/calendar"
        />
        <StatCard
          label="Scheduled this week"
          value={scheduledThisWeek}
          href="/admin/bookings"
        />
        <StatCard
          label="Active customers"
          value={activeCustomers}
          href="/admin/bookings"
        />
      </div>

      <div className="mt-10 max-w-[900px]">
        <Link
          href="/admin/bookings"
          className="inline-flex h-11 px-5 items-center justify-center bg-blue hover:bg-blue-soft text-white rounded-btn text-[13px] font-semibold uppercase tracking-[0.06em] transition-colors"
        >
          View all bookings →
        </Link>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block p-6 border border-white/10 hover:border-blue bg-navy-2/40 transition-colors"
    >
      <div className="mono-eyebrow text-white/50 mb-2">{label}</div>
      <div className="font-display text-[56px] leading-none">{value}</div>
    </Link>
  );
}

/** Add `n` days to a YYYY-MM-DD key via civil arithmetic (DST-safe). */
function addDaysToKey(key: string, n: number): string {
  const [y, m, d] = key.split("-").map(Number);
  // Anchor at noon UTC so ±n-day steps never cross into an adjacent civil day.
  const dt = new Date(Date.UTC(y, m - 1, d + n, 12, 0, 0));
  const pad = (x: number) => String(x).padStart(2, "0");
  return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`;
}
