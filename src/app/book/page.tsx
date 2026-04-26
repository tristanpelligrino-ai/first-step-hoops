import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Session — First Step Hoops",
  description:
    "Pick a session plan and book your child's first basketball training session.",
};

export default function BookPlanPicker() {
  return (
    <div className="container-fsh py-20">
      <div className="mono-eyebrow text-blue mb-3">
        <span className="inline-block w-6 h-px bg-blue mr-[10px] align-middle" />
        Step 1 of 3
      </div>
      <h1
        className="display m-0 mb-6"
        style={{ fontSize: "clamp(48px, 7vw, 96px)" }}
      >
        Pick a Plan.
      </h1>
      <p className="text-white/70 text-[17px] max-w-[60ch] mb-12">
        Single sessions are available now. The 4-pack with discounted pricing
        and 60-day credits is launching soon — check back, or grab a single
        session and we&apos;ll let you know.
      </p>

      <div className="grid grid-cols-2 gap-6 max-w-[860px] max-[760px]:grid-cols-1">
        <Link
          href="/book/slots"
          className="group flex flex-col p-9 border border-white/15 hover:border-blue bg-navy-2/40 transition-colors"
        >
          <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-white/60 mb-[18px]">
            Single Session
          </div>
          <div className="font-display leading-[0.9] mb-[6px] text-[88px] max-[760px]:text-[64px]">
            <span className="text-[32px] align-top mr-1 opacity-70">$</span>
            25
          </div>
          <div className="text-[13px] text-white/60 mb-6">per session · 1 hour</div>
          <p className="text-[15px] text-white/70 m-0 mb-6 flex-1">
            A focused training session designed to introduce and reinforce core
            fundamentals.
          </p>
          <ul className="list-none p-0 m-0 mb-7 border-t border-white/10">
            {["One 60-minute session", "Skill assessment included", "Take-home practice plan"].map(
              (f) => (
                <li
                  key={f}
                  className="flex items-center gap-[10px] py-3 text-[14px] border-b border-white/10"
                >
                  <span
                    className="inline-block bg-orange shrink-0"
                    style={{ width: 8, height: 8 }}
                    aria-hidden="true"
                  />
                  {f}
                </li>
              ),
            )}
          </ul>
          <span className="mt-auto h-11 px-5 inline-flex items-center justify-center bg-blue group-hover:bg-blue-soft text-white rounded-btn text-[13px] font-semibold uppercase tracking-[0.06em] transition-colors w-fit">
            Pick a Time →
          </span>
        </Link>

        <div className="relative flex flex-col p-9 border border-white/10 bg-navy-2/20 opacity-60 cursor-not-allowed">
          <div className="absolute top-[-1px] right-[-1px] bg-white/10 text-white/70 font-mono text-[10px] tracking-[0.14em] uppercase px-3 py-[6px]">
            Coming Soon
          </div>
          <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-white/60 mb-[18px]">
            4-Pack
          </div>
          <div className="font-display leading-[0.9] mb-[6px] text-[88px] max-[760px]:text-[64px]">
            <span className="text-[32px] align-top mr-1 opacity-70">$</span>
            75
          </div>
          <div className="text-[13px] text-white/60 mb-6">4 sessions · save $25</div>
          <p className="text-[15px] text-white/70 m-0 mb-6 flex-1">
            Build consistency, improve skills, and gain confidence over time.
          </p>
          <ul className="list-none p-0 m-0 mb-7 border-t border-white/10">
            {[
              "Four 60-minute sessions",
              "Progress check-ins",
              "Flexible scheduling (60-day expiry)",
              "Parent updates after each session",
            ].map((f) => (
              <li
                key={f}
                className="flex items-center gap-[10px] py-3 text-[14px] border-b border-white/10"
              >
                <span
                  className="inline-block bg-white/30 shrink-0"
                  style={{ width: 8, height: 8 }}
                  aria-hidden="true"
                />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
