import Link from "next/link";
import type { Metadata } from "next";
import { and, asc, eq, gt } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { formatDateLong, formatTimeShort, formatDayKey, BUSINESS_TZ } from "@/lib/time";

export const metadata: Metadata = {
  title: "Pick a Time — First Step Hoops",
};

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

const ERROR_COPY: Record<string, string> = {
  "not-found": "That session no longer exists. Pick another below.",
  unavailable: "That session isn't available anymore. Pick another below.",
  taken: "Someone just booked that session. Pick another below.",
  stripe: "Couldn't reach payment processor. Try again in a moment.",
};

export default async function PickSlotPage({ searchParams }: Props) {
  const { error } = await searchParams;

  const now = new Date();
  const rows = await db
    .select()
    .from(schema.slots)
    .where(
      and(
        eq(schema.slots.status, "open"),
        eq(schema.slots.isPrivate, false),
        gt(schema.slots.startsAt, now),
      ),
    )
    .orderBy(asc(schema.slots.startsAt))
    .limit(200);

  // Group by day key (in business TZ)
  const byDay = new Map<string, typeof rows>();
  for (const s of rows) {
    const key = formatDayKey(s.startsAt);
    const bucket = byDay.get(key) ?? [];
    bucket.push(s);
    byDay.set(key, bucket);
  }
  const days = Array.from(byDay.entries());

  return (
    <div className="container-fsh py-20">
      <div className="mono-eyebrow text-blue mb-3">
        <span className="inline-block w-6 h-px bg-blue mr-[10px] align-middle" />
        Step 2 of 3
      </div>
      <h1
        className="display m-0 mb-6"
        style={{ fontSize: "clamp(48px, 7vw, 96px)" }}
      >
        Pick a Time.
      </h1>
      <p className="text-white/70 text-[17px] max-w-[60ch] mb-3">
        All sessions are 50 minutes and held at the location shown for each
        slot. Your child will get a focused 1-on-1 training session.
      </p>
      <p className="text-[12px] font-mono uppercase tracking-[0.08em] text-white/50 mb-10">
        Times shown in {BUSINESS_TZ.replace("_", " ")}
      </p>

      {error && ERROR_COPY[error] ? (
        <div className="mb-8 p-4 border border-orange/40 bg-orange/10 text-orange text-[14px]">
          {ERROR_COPY[error]}
        </div>
      ) : null}

      {days.length === 0 ? (
        <div className="p-10 border border-white/10 bg-navy-2/40 text-white/70 max-w-[720px]">
          No open sessions right now. Check back soon — we add availability
          weekly.
        </div>
      ) : (
        <div className="flex flex-col gap-8 max-w-[820px]">
          {days.map(([dayKey, slots]) => (
            <section key={dayKey}>
              <h2 className="font-display text-[28px] leading-none mb-3">
                {formatDateLong(slots[0].startsAt)}
              </h2>
              <div className="border border-white/10 bg-navy-2/40">
                {slots.map((s, i) => (
                  <Link
                    key={s.id}
                    href={`/book/details?slot=${s.id}`}
                    className={`flex items-center gap-6 px-5 py-4 hover:bg-white/[0.03] transition-colors ${i !== 0 ? "border-t border-white/5" : ""}`}
                  >
                    <div className="font-display text-[24px] leading-none min-w-[120px]">
                      {formatTimeShort(s.startsAt)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] text-white truncate">{s.location}</div>
                      <div className="text-[12px] font-mono uppercase tracking-[0.08em] text-white/50 mt-1">
                        {s.durationMin} min
                      </div>
                    </div>
                    <span className="text-blue-soft text-[13px] font-medium">
                      Book →
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <div className="mt-12">
        <Link
          href="/book"
          className="text-white/60 hover:text-white text-[13px] font-mono uppercase tracking-[0.08em] transition-colors"
        >
          ← Back to plans
        </Link>
      </div>
    </div>
  );
}
