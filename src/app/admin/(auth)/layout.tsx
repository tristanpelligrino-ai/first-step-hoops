import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/admin-session";
import { logoutAction } from "../login/actions";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/calendar", label: "Calendar" },
  { href: "/admin/slots", label: "Slots" },
  // Bookings, Customers, Waivers come online in later phases.
];

export default async function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session.adminId) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-navy text-white flex">
      <aside className="w-[240px] shrink-0 border-r border-white/10 flex flex-col">
        <div className="px-6 h-[72px] flex items-center border-b border-white/10">
          <span className="font-wordmark font-bold text-[18px] lowercase leading-none">
            first<span className="text-blue">_</span>step hoops
          </span>
        </div>

        <nav className="flex-1 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-6 py-2 text-[14px] text-white/70 hover:text-white hover:bg-white/[0.03] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="mono-eyebrow text-white/50 mb-2">Signed in as</div>
          <div className="text-[14px] mb-3 truncate">{session.username}</div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full h-9 bg-transparent border border-white/20 hover:border-white/60 text-white text-[12px] uppercase tracking-[0.06em] font-semibold rounded-btn transition-colors"
            >
              Log out
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
