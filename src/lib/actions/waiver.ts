"use server";

import { and, eq, ne } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/lib/db";
import { getAdminSession } from "@/lib/auth/admin-session";
import { waiverVersionInputSchema } from "@/lib/validation/waiver";

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session.adminId) {
    redirect("/admin/login");
  }
}

export async function publishWaiverVersionAction(formData: FormData) {
  await requireAdmin();

  const parsed = waiverVersionInputSchema.safeParse({
    version: formData.get("version"),
    bodyMd: formData.get("bodyMd"),
  });

  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid waiver";
    redirect(`/admin/waiver?error=${encodeURIComponent(msg)}`);
  }

  const { version, bodyMd } = parsed.data;

  // Insert the new version as current first, then demote every other version.
  // Doing it in this order means a booking in flight always sees a current waiver.
  const [created] = await db
    .insert(schema.waiverVersions)
    .values({ version, bodyMd, isCurrent: true })
    .returning({ id: schema.waiverVersions.id });

  await db
    .update(schema.waiverVersions)
    .set({ isCurrent: false })
    .where(
      and(
        eq(schema.waiverVersions.isCurrent, true),
        ne(schema.waiverVersions.id, created.id),
      ),
    );

  revalidatePath("/admin/waiver");
  revalidatePath("/book/details");
  redirect("/admin/waiver?published=1");
}
