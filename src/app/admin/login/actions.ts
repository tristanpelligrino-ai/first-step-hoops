"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db, schema } from "@/lib/db";
import { getAdminSession } from "@/lib/auth/admin-session";

export async function loginAction(formData: FormData) {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");

  if (!username || !password) {
    redirect("/admin/login?error=missing");
  }

  const [user] = await db
    .select()
    .from(schema.adminUsers)
    .where(eq(schema.adminUsers.username, username))
    .limit(1);

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    // Generic message — don't leak which field was wrong
    redirect("/admin/login?error=invalid");
  }

  const session = await getAdminSession();
  session.adminId = user.id;
  session.username = user.username;
  await session.save();

  await db
    .update(schema.adminUsers)
    .set({ lastLoginAt: new Date() })
    .where(eq(schema.adminUsers.id, user.id));

  redirect("/admin");
}

export async function logoutAction() {
  const session = await getAdminSession();
  session.destroy();
  redirect("/admin/login");
}
