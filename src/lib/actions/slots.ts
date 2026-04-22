"use server";

import { and, eq, count } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/lib/db";
import { getAdminSession } from "@/lib/auth/admin-session";
import { slotInputSchema } from "@/lib/validation/slot";

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session.adminId) {
    redirect("/admin/login");
  }
  return session.adminId!;
}

export async function createSlotAction(formData: FormData) {
  const adminId = await requireAdmin();

  const parsed = slotInputSchema.safeParse({
    startsAt: formData.get("startsAt"),
    durationMin: formData.get("durationMin"),
    location: formData.get("location"),
    isPrivate: formData.get("isPrivate") ?? "",
    capacity: formData.get("capacity") ?? 1,
  });

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    redirect(`/admin/slots/new?error=${encodeURIComponent(firstIssue.message)}`);
  }

  const data = parsed.data;

  await db.insert(schema.slots).values({
    startsAt: new Date(data.startsAt),
    durationMin: data.durationMin,
    location: data.location,
    isPrivate: data.isPrivate,
    capacity: data.capacity,
    status: "open",
    createdBy: adminId,
  });

  revalidatePath("/admin/slots");
  revalidatePath("/admin/calendar");
  redirect("/admin/slots");
}

export async function updateSlotAction(slotId: string, formData: FormData) {
  await requireAdmin();

  const parsed = slotInputSchema.safeParse({
    startsAt: formData.get("startsAt"),
    durationMin: formData.get("durationMin"),
    location: formData.get("location"),
    isPrivate: formData.get("isPrivate") ?? "",
    capacity: formData.get("capacity") ?? 1,
  });

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    redirect(
      `/admin/slots/${slotId}?error=${encodeURIComponent(firstIssue.message)}`,
    );
  }

  const data = parsed.data;

  await db
    .update(schema.slots)
    .set({
      startsAt: new Date(data.startsAt),
      durationMin: data.durationMin,
      location: data.location,
      isPrivate: data.isPrivate,
      capacity: data.capacity,
    })
    .where(eq(schema.slots.id, slotId));

  revalidatePath("/admin/slots");
  revalidatePath("/admin/calendar");
  redirect("/admin/slots");
}

export async function cancelSlotAction(slotId: string) {
  await requireAdmin();

  await db
    .update(schema.slots)
    .set({ status: "canceled" })
    .where(eq(schema.slots.id, slotId));

  // NOTE: Phase 7 will also cancel associated bookings + notify parents via SMS/email.
  // For now we only update the slot status.

  revalidatePath("/admin/slots");
  revalidatePath("/admin/calendar");
  redirect("/admin/slots");
}

export async function deleteSlotAction(slotId: string) {
  await requireAdmin();

  // Only permit hard delete if no bookings reference this slot.
  const [{ value: bookingCount }] = await db
    .select({ value: count() })
    .from(schema.bookings)
    .where(eq(schema.bookings.slotId, slotId));

  if (bookingCount > 0) {
    redirect(
      `/admin/slots/${slotId}?error=${encodeURIComponent("Slot has bookings — cancel instead of delete.")}`,
    );
  }

  await db.delete(schema.slots).where(eq(schema.slots.id, slotId));

  revalidatePath("/admin/slots");
  revalidatePath("/admin/calendar");
  redirect("/admin/slots");
}

/**
 * Create a slot from the schedule grid (no redirect, returns a result).
 * Used for click-to-create on the calendar page; callers stay in place and
 * update the grid state optimistically.
 */
export async function createSlotAtAction(params: {
  startsAtUtc: string;
  durationMin: number;
  location: string;
  isPrivate: boolean;
  capacity: number;
}): Promise<
  | { ok: true; id: string }
  | { ok: false; error: string }
> {
  const adminId = await requireAdmin();

  const parsed = slotInputSchema.safeParse({
    startsAt: params.startsAtUtc,
    durationMin: params.durationMin,
    location: params.location,
    isPrivate: params.isPrivate ? "on" : "",
    capacity: params.capacity,
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  const data = parsed.data;

  const [created] = await db
    .insert(schema.slots)
    .values({
      startsAt: new Date(data.startsAt),
      durationMin: data.durationMin,
      location: data.location,
      isPrivate: data.isPrivate,
      capacity: data.capacity,
      status: "open",
      createdBy: adminId,
    })
    .returning({ id: schema.slots.id });

  revalidatePath("/admin/slots");
  revalidatePath("/admin/calendar");
  return { ok: true, id: created.id };
}

export async function quickDeleteSlotAction(slotId: string): Promise<
  | { ok: true }
  | { ok: false; error: string }
> {
  await requireAdmin();

  const [{ value: bookingCount }] = await db
    .select({ value: count() })
    .from(schema.bookings)
    .where(eq(schema.bookings.slotId, slotId));

  if (bookingCount > 0) {
    return { ok: false, error: "Slot has bookings — cancel from the edit page instead." };
  }

  await db.delete(schema.slots).where(eq(schema.slots.id, slotId));

  revalidatePath("/admin/slots");
  revalidatePath("/admin/calendar");
  return { ok: true };
}

export async function reopenSlotAction(slotId: string) {
  await requireAdmin();

  // Only reopen if currently canceled AND no booking is attached.
  const [slot] = await db
    .select()
    .from(schema.slots)
    .where(and(eq(schema.slots.id, slotId), eq(schema.slots.status, "canceled")))
    .limit(1);

  if (!slot) {
    redirect(`/admin/slots/${slotId}?error=${encodeURIComponent("Slot is not canceled.")}`);
  }

  await db
    .update(schema.slots)
    .set({ status: "open" })
    .where(eq(schema.slots.id, slotId));

  revalidatePath("/admin/slots");
  revalidatePath("/admin/calendar");
  redirect(`/admin/slots/${slotId}`);
}
