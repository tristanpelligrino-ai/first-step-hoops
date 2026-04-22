import Link from "next/link";
import type { Metadata } from "next";
import { desc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { formatDateLong, formatTimeShort } from "@/lib/time";

export const metadata: Metadata = {
  title: "Slots — First Step Hoops Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function SlotsPage() {
  const rows = await db
    .select()
    .from(schema.slots)
    .orderBy(desc(schema.slots.startsAt))
    .limit(200);

  return (
    <div className="px-10 py-10">
      <AdminPageHeader
        eyebrow="Manage"
        title="Slots"
        actions={
          <Link
            href="/admin/slots/new"
            className="h-11 px-5 inline-flex items-center justify-center bg-blue hover:bg-blue-soft text-white rounded-btn text-[13px] font-semibold uppercase tracking-[0.06em] transition-colors"
          >
            + New Slot
          </Link>
        }
      />

      {rows.length === 0 ? (
        <div className="p-10 border border-white/10 bg-navy-2/40 text-white/70">
          No slots yet. Click <strong className="text-white">+ New Slot</strong> to create your first one.
        </div>
      ) : (
        <div className="border border-white/10 bg-navy-2/40 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white/[0.03] text-[11px] uppercase tracking-[0.12em] font-mono text-white/50">
              <tr>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Time</th>
                <th className="px-5 py-3 font-medium">Location</th>
                <th className="px-5 py-3 font-medium">Duration</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                  <td className="px-5 py-3 text-[14px]">{formatDateLong(s.startsAt)}</td>
                  <td className="px-5 py-3 text-[14px]">{formatTimeShort(s.startsAt)}</td>
                  <td className="px-5 py-3 text-[14px] text-white/80">{s.location}</td>
                  <td className="px-5 py-3 text-[14px] text-white/60">{s.durationMin} min</td>
                  <td className="px-5 py-3">
                    <StatusPill status={s.status} />
                  </td>
                  <td className="px-5 py-3 text-[12px] font-mono uppercase tracking-[0.08em] text-white/60">
                    {s.isPrivate ? "Private" : "Public"}
                    {s.capacity > 1 ? ` · ${s.capacity}` : ""}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`/admin/slots/${s.id}`}
                      className="text-blue-soft hover:text-blue text-[13px] font-medium"
                    >
                      Edit
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
