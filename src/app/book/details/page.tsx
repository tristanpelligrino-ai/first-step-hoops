import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { formatDateLong, formatTimeShort, BUSINESS_TZ } from "@/lib/time";
import { startSingleSessionCheckoutAction } from "@/lib/actions/booking";
import { SubmitButton } from "@/components/admin/form/SubmitButton";

export const metadata: Metadata = {
  title: "Your Info — First Step Hoops",
};

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ slot?: string; error?: string }>;
};

export default async function BookingDetailsPage({ searchParams }: Props) {
  const { slot: slotId, error } = await searchParams;

  if (!slotId) redirect("/book/slots");

  const [slot] = await db
    .select()
    .from(schema.slots)
    .where(eq(schema.slots.id, slotId))
    .limit(1);

  if (!slot) notFound();

  // Don't allow filling the form for an unavailable slot
  if (slot.isPrivate || slot.status !== "open" || slot.startsAt < new Date()) {
    redirect("/book/slots?error=unavailable");
  }

  return (
    <div className="container-fsh py-20">
      <div className="mono-eyebrow text-blue mb-3">
        <span className="inline-block w-6 h-px bg-blue mr-[10px] align-middle" />
        Step 3 of 3
      </div>
      <h1
        className="display m-0 mb-6"
        style={{ fontSize: "clamp(48px, 7vw, 96px)" }}
      >
        Your Info.
      </h1>

      <div className="mb-10 p-5 border border-blue/30 bg-blue/[0.06] max-w-[640px]">
        <div className="mono-eyebrow text-blue-soft mb-2">Selected session</div>
        <div className="text-[18px] font-display leading-tight">
          {formatDateLong(slot.startsAt)} at {formatTimeShort(slot.startsAt)}
        </div>
        <div className="text-[14px] text-white/70 mt-1">{slot.location}</div>
        <div className="text-[12px] font-mono uppercase tracking-[0.08em] text-white/50 mt-2">
          {slot.durationMin} min · {BUSINESS_TZ.replace("_", " ")}
        </div>
      </div>

      {error ? (
        <p className="mb-6 text-orange text-[13px] font-mono">{error}</p>
      ) : null}

      <form
        action={startSingleSessionCheckoutAction}
        className="grid grid-cols-2 gap-5 max-w-[640px] max-[640px]:grid-cols-1"
      >
        <input type="hidden" name="slotId" value={slot.id} />

        <div className="col-span-2">
          <SectionLabel>Parent / guardian</SectionLabel>
        </div>
        <Field name="parentName" label="Full name" required autoComplete="name" />
        <Field
          name="parentEmail"
          label="Email"
          type="email"
          required
          autoComplete="email"
        />
        <Field
          name="parentPhone"
          label="Phone"
          type="tel"
          required
          autoComplete="tel"
          hint="We'll send booking + reminder texts here."
          fullWidth
        />

        <div className="col-span-2 mt-4">
          <SectionLabel>Player</SectionLabel>
        </div>
        <Field name="playerName" label="Player's name" required />
        <SelectField
          name="grade"
          label="Grade"
          required
          options={[
            { value: "3rd", label: "3rd grade" },
            { value: "4th", label: "4th grade" },
            { value: "5th", label: "5th grade" },
            { value: "other", label: "Other" },
          ]}
        />
        <TextArea
          name="experienceNotes"
          label="Experience"
          placeholder="New to basketball? Played a season or two? Anything you'd like the coach to know."
          fullWidth
        />
        <TextArea
          name="medicalNotes"
          label="Medical notes"
          placeholder="Allergies, asthma, recent injuries, anything the coach should know in case of emergency."
          fullWidth
        />

        <div className="col-span-2 flex items-center gap-4 mt-4">
          <SubmitButton>Continue to Payment →</SubmitButton>
          <Link
            href="/book/slots"
            className="text-white/60 hover:text-white text-[13px] font-mono uppercase tracking-[0.08em] transition-colors"
          >
            ← Back
          </Link>
        </div>

        <p className="col-span-2 text-[12px] text-white/50 max-w-[60ch] mt-2">
          Payment is processed securely by Stripe. We never see or store your
          card information. You&apos;ll receive a receipt by email and a booking
          confirmation by text.
        </p>
      </form>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mono-eyebrow text-white/60 pb-3 border-b border-white/10 mb-1">
      {children}
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  autoComplete,
  hint,
  fullWidth,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  hint?: string;
  fullWidth?: boolean;
}) {
  return (
    <label className={`flex flex-col gap-2 ${fullWidth ? "col-span-2" : ""}`}>
      <span className="mono-eyebrow text-white/60">
        {label}
        {required ? <span className="text-orange"> *</span> : null}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="h-11 px-3 bg-navy-2 border border-white/15 rounded-btn text-white text-[15px] focus:border-blue focus:outline-none"
      />
      {hint ? <span className="text-[12px] text-white/50">{hint}</span> : null}
    </label>
  );
}

function SelectField({
  name,
  label,
  required,
  options,
}: {
  name: string;
  label: string;
  required?: boolean;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="mono-eyebrow text-white/60">
        {label}
        {required ? <span className="text-orange"> *</span> : null}
      </span>
      <select
        name={name}
        required={required}
        defaultValue=""
        className="h-11 px-3 bg-navy-2 border border-white/15 rounded-btn text-white text-[15px] focus:border-blue focus:outline-none"
      >
        <option value="" disabled>
          Pick one
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextArea({
  name,
  label,
  placeholder,
  fullWidth,
}: {
  name: string;
  label: string;
  placeholder?: string;
  fullWidth?: boolean;
}) {
  return (
    <label className={`flex flex-col gap-2 ${fullWidth ? "col-span-2" : ""}`}>
      <span className="mono-eyebrow text-white/60">{label}</span>
      <textarea
        name={name}
        placeholder={placeholder}
        rows={3}
        className="px-3 py-2 bg-navy-2 border border-white/15 rounded-btn text-white text-[15px] focus:border-blue focus:outline-none resize-y"
      />
    </label>
  );
}
