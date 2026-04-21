import Link from "next/link";
import { Button } from "./ui/Button";
import { Wordmark } from "./ui/Wordmark";

const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#coach", label: "Coach" },
  { href: "#programs", label: "Programs" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 bg-navy text-white border-b border-white/[0.06]">
      <div className="container-fsh flex items-center justify-between h-[72px]">
        <Link href="/" aria-label="First Step Hoops home">
          <Wordmark />
        </Link>
        <nav className="hidden md:flex gap-7 text-[13px] font-medium text-white/[0.78]">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="hover:text-white transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <Button href="/book">Book a Session</Button>
      </div>
    </header>
  );
}
