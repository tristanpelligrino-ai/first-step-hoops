import type { Metadata } from "next";
import { loginAction } from "./actions";

export const metadata: Metadata = {
  title: "Admin Login — First Step Hoops",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const { error } = await searchParams;
  const errorMessage =
    error === "invalid"
      ? "Invalid username or password."
      : error === "missing"
        ? "Username and password are required."
        : null;

  return (
    <main className="min-h-screen bg-navy text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mono-eyebrow text-blue mb-4">
          <span className="inline-block w-6 h-px bg-blue mr-[10px] align-middle" />
          Admin
        </div>
        <h1
          className="display m-0 mb-8"
          style={{ fontSize: "clamp(40px, 6vw, 60px)" }}
        >
          Sign In
        </h1>

        <form action={loginAction} className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="mono-eyebrow text-white/60">Username</span>
            <input
              name="username"
              type="text"
              autoComplete="username"
              required
              className="h-11 px-3 bg-navy-2 border border-white/15 rounded-btn text-white text-[15px] focus:border-blue focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="mono-eyebrow text-white/60">Password</span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="h-11 px-3 bg-navy-2 border border-white/15 rounded-btn text-white text-[15px] focus:border-blue focus:outline-none"
            />
          </label>

          {errorMessage ? (
            <p className="text-orange text-[13px] font-mono">{errorMessage}</p>
          ) : null}

          <button
            type="submit"
            className="h-11 mt-2 bg-blue hover:bg-blue-soft text-white rounded-btn text-[13px] font-semibold uppercase tracking-[0.06em] transition-colors"
          >
            Log In
          </button>
        </form>
      </div>
    </main>
  );
}
