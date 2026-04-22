import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SlotForm } from "@/components/admin/SlotForm";
import { createSlotAction } from "@/lib/actions/slots";

export const metadata: Metadata = {
  title: "New Slot — First Step Hoops Admin",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function NewSlotPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <div className="px-10 py-10">
      <AdminPageHeader
        eyebrow="Create"
        title="New Slot"
        actions={
          <Link
            href="/admin/slots"
            className="h-11 px-5 inline-flex items-center justify-center bg-transparent border border-white/25 hover:border-white text-white rounded-btn text-[13px] font-semibold uppercase tracking-[0.06em] transition-colors"
          >
            Cancel
          </Link>
        }
      />

      {error ? (
        <p className="mb-6 text-orange text-[13px] font-mono">{error}</p>
      ) : null}

      <SlotForm mode="create" action={createSlotAction} />
    </div>
  );
}
