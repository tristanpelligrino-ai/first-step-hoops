import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq, count } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SlotForm } from "@/components/admin/SlotForm";
import {
  updateSlotAction,
  cancelSlotAction,
  deleteSlotAction,
  reopenSlotAction,
} from "@/lib/actions/slots";
import { SubmitButton } from "@/components/admin/form/SubmitButton";

export const metadata: Metadata = {
  title: "Edit Slot — First Step Hoops Admin",
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function EditSlotPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { error } = await searchParams;

  const [slot] = await db
    .select()
    .from(schema.slots)
    .where(eq(schema.slots.id, id))
    .limit(1);

  if (!slot) notFound();

  const [{ value: bookingCount }] = await db
    .select({ value: count() })
    .from(schema.bookings)
    .where(eq(schema.bookings.slotId, id));

  const boundUpdate = updateSlotAction.bind(null, id);
  const boundCancel = cancelSlotAction.bind(null, id);
  const boundDelete = deleteSlotAction.bind(null, id);
  const boundReopen = reopenSlotAction.bind(null, id);

  return (
    <div className="px-10 py-10">
      <AdminPageHeader
        eyebrow="Edit"
        title="Slot Details"
        actions={
          <Link
            href="/admin/slots"
            className="h-11 px-5 inline-flex items-center justify-center bg-transparent border border-white/25 hover:border-white text-white rounded-btn text-[13px] font-semibold uppercase tracking-[0.06em] transition-colors"
          >
            Back
          </Link>
        }
      />

      {error ? (
        <p className="mb-6 text-orange text-[13px] font-mono">{error}</p>
      ) : null}

      <div className="grid grid-cols-[1fr_320px] gap-10 max-[1000px]:grid-cols-1 items-start">
        <SlotForm
          mode="edit"
          action={boundUpdate}
          defaults={{
            startsAtUtc: slot.startsAt.toISOString(),
            durationMin: slot.durationMin,
            location: slot.location,
            isPrivate: slot.isPrivate,
            capacity: slot.capacity,
          }}
        />

        <aside className="flex flex-col gap-4 p-6 border border-white/10 bg-navy-2/40">
          <div>
            <div className="mono-eyebrow text-white/50 mb-1">Status</div>
            <div className="text-white text-[15px] capitalize">{slot.status}</div>
          </div>
          <div>
            <div className="mono-eyebrow text-white/50 mb-1">Bookings</div>
            <div className="text-white text-[15px]">{bookingCount}</div>
          </div>

          <hr className="border-white/10 my-2" />

          {slot.status !== "canceled" ? (
            <form action={boundCancel}>
              <SubmitButton variant="danger">Cancel Slot</SubmitButton>
            </form>
          ) : (
            <form action={boundReopen}>
              <SubmitButton variant="primary">Reopen Slot</SubmitButton>
            </form>
          )}

          <form action={boundDelete}>
            <SubmitButton variant="ghost">
              {bookingCount > 0 ? "Delete (blocked — has bookings)" : "Delete Permanently"}
            </SubmitButton>
          </form>

          <p className="text-[12px] text-white/50 mt-2 leading-[1.5]">
            Cancel marks the slot as canceled (customer notifications will be sent in a later
            phase). Delete fully removes the slot — only allowed when no bookings exist.
          </p>
        </aside>
      </div>
    </div>
  );
}
