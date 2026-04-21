import Link from "next/link";
import { Wordmark } from "./ui/Wordmark";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="text-white/60 text-[13px]"
      style={{ background: "#060a17", padding: "40px 0 32px" }}
    >
      <div className="container-fsh flex justify-between items-center flex-wrap gap-5">
        <Link href="/" aria-label="First Step Hoops home">
          <Wordmark size="footer" />
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms
          </Link>
          <span>© {year} First Step Hoops · Youth Basketball Training</span>
        </div>
      </div>
    </footer>
  );
}
