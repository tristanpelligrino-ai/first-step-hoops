import type { Metadata } from "next";
import { desc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { TextField } from "@/components/admin/form/TextField";
import { SubmitButton } from "@/components/admin/form/SubmitButton";
import { publishWaiverVersionAction } from "@/lib/actions/waiver";
import { formatDateLong } from "@/lib/time";

export const metadata: Metadata = {
  title: "Waiver — First Step Hoops Admin",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ error?: string; published?: string }>;
};

export default async function AdminWaiverPage({ searchParams }: Props) {
  const { error, published } = await searchParams;

  const versions = await db
    .select()
    .from(schema.waiverVersions)
    .orderBy(desc(schema.waiverVersions.effectiveFrom));

  const current = versions.find((v) => v.isCurrent) ?? null;
  const past = versions.filter((v) => v.id !== current?.id);

  return (
    <div className="px-10 py-10 max-w-[880px]">
      <AdminPageHeader eyebrow="Legal" title="Liability Waiver" />

      {published ? (
        <p className="mb-6 p-3 border border-blue/40 bg-blue/[0.08] text-blue-soft text-[13px] font-mono">
          New waiver version published — it now applies to all new bookings.
        </p>
      ) : null}
      {error ? (
        <p className="mb-6 text-orange text-[13px] font-mono">{error}</p>
      ) : null}

      <section className="mb-12">
        <div className="mono-eyebrow text-white/60 pb-3 border-b border-white/10 mb-4">
          Current version
        </div>
        {current ? (
          <div className="border border-white/15 bg-navy-2 rounded-btn">
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between gap-4">
              <span className="font-display text-[16px]">
                Version {current.version}
              </span>
              <span className="text-[12px] font-mono uppercase tracking-[0.07em] text-white/50">
                Effective {formatDateLong(current.effectiveFrom)}
              </span>
            </div>
            <div className="px-4 py-4 max-h-80 overflow-y-auto text-[13px] leading-relaxed text-white/75 whitespace-pre-wrap">
              {current.bodyMd}
            </div>
          </div>
        ) : (
          <p className="p-4 border border-orange/40 bg-orange/[0.08] text-[14px] text-white/80">
            No waiver has been published yet.{" "}
            <strong>
              Parents cannot complete a booking until you publish one below.
            </strong>
          </p>
        )}
      </section>

      <section className="mb-12">
        <div className="mono-eyebrow text-white/60 pb-3 border-b border-white/10 mb-4">
          Publish a new version
        </div>
        <p className="text-[13px] text-white/60 mb-5 max-w-[68ch]">
          Paste the waiver text provided by your attorney or insurer. Publishing
          makes it the waiver every new booking must sign. Waivers already signed
          stay bound to the version that was current when the parent signed them.
        </p>
        <form action={publishWaiverVersionAction} className="flex flex-col gap-5">
          <div className="max-w-[280px]">
            <TextField
              name="version"
              label="Version label"
              required
              placeholder="e.g. v1 or 2026-05"
            />
          </div>
          <label className="flex flex-col gap-2">
            <span className="mono-eyebrow text-white/60">
              Waiver text <span className="text-orange">*</span>
            </span>
            <textarea
              name="bodyMd"
              required
              rows={16}
              placeholder="Paste the full waiver text here…"
              className="px-3 py-3 bg-navy-2 border border-white/15 rounded-btn text-white text-[14px] leading-relaxed focus:border-blue focus:outline-none resize-y font-mono"
            />
            <span className="text-[12px] text-white/50">
              Plain text. Leave a blank line between paragraphs.
            </span>
          </label>
          <div>
            <SubmitButton>Publish waiver</SubmitButton>
          </div>
        </form>
      </section>

      {past.length > 0 ? (
        <section>
          <div className="mono-eyebrow text-white/60 pb-3 border-b border-white/10 mb-4">
            Previous versions
          </div>
          <ul className="flex flex-col gap-2">
            {past.map((v) => (
              <li
                key={v.id}
                className="text-[13px] text-white/60 flex items-center gap-3"
              >
                <span className="font-display text-white/80">
                  Version {v.version}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.07em]">
                  {formatDateLong(v.effectiveFrom)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
