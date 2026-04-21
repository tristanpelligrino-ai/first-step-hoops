import type { Metadata } from "next";
import { getAdminSession } from "@/lib/auth/admin-session";

export const metadata: Metadata = {
  title: "Dashboard — First Step Hoops Admin",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const session = await getAdminSession();

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
        <StatCard label="Sessions today" value="0" />
        <StatCard label="Scheduled this week" value="0" />
        <StatCard label="Active customers" value="0" />
      </div>

      <div className="mt-10 max-w-[900px] p-6 border border-white/10 bg-navy-2/40">
        <div className="mono-eyebrow text-white/50 mb-2">Up next</div>
        <p className="text-white/70 text-[15px] m-0">
          Slot management, booking controls, and customer views come online in the next phases.
          This shell proves auth + layout are wired up and session persists across requests.
        </p>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-6 border border-white/10 bg-navy-2/40">
      <div className="mono-eyebrow text-white/50 mb-2">{label}</div>
      <div className="font-display text-[56px] leading-none">{value}</div>
    </div>
  );
}
