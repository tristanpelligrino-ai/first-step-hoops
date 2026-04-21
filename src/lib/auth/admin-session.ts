import { getIronSession, type IronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export type AdminSessionData = {
  adminId?: string;
  username?: string;
};

function sessionOptions(): SessionOptions {
  const password = process.env.ADMIN_SESSION_SECRET;
  if (!password) {
    throw new Error("ADMIN_SESSION_SECRET is not set");
  }
  return {
    password,
    cookieName: "fsh_admin_session",
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    },
  };
}

export async function getAdminSession(): Promise<IronSession<AdminSessionData>> {
  const cookieStore = await cookies();
  return getIronSession<AdminSessionData>(cookieStore, sessionOptions());
}
