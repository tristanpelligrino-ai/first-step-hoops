"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/lib/db";
import { getAdminSession } from "@/lib/auth/admin-session";
import { bookingStatusUpdateSchema } from "@/lib/validation/booking";

/**
 * Admin: change a booking's session status (scheduled / delivered / no_show /
 * canceled). v1 is single-session only, so there is no credit ledger to
 * adjust here — that logic arrives with the 4-pack in a later phase.
 */
export async function updateBookingStatusAction(formData: FormData) {
  const session = await getAdminSession();
  if (!session.adminId) {
    redirect("/admin/login");
  }

  const parsed = bookingStatusUpdateSchema.safeParse({
    bookingId: formData.get("bookingId"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    redirect("/admin/bookings");
  }

  const { bookingId, status } = parsed.data;

  await db
    .update(schema.bookings)
    .set({
      status,
      statusChangedAt: new Date(),
      statusChangedBy: session.adminId,
    })
    .where(eq(schema.bookings.id, bookingId));

  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${bookingId}`);
  redirect(`/admin/bookings/${bookingId}?updated=1`);
}
