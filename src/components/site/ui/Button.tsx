import Link from "next/link";
import { ArrowIcon } from "./ArrowIcon";

type Variant = "primary" | "ghost" | "dark";

const variantClasses: Record<Variant, string> = {
  primary: "bg-blue text-white hover:bg-blue-soft",
  ghost:
    "bg-transparent text-white border border-white/25 hover:border-white",
  dark: "bg-navy text-white hover:bg-navy-3",
};

export function Button({
  href,
  variant = "primary",
  withArrow = true,
  children,
  className = "",
}: {
  href: string;
  variant?: Variant;
  withArrow?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-[10px] h-11 px-5 rounded-btn font-sans text-[13px] font-semibold uppercase tracking-[0.06em] whitespace-nowrap transition-[transform,background,color,border-color] duration-150 hover:-translate-y-px ${variantClasses[variant]} ${className}`}
    >
      {children}
      {withArrow ? <ArrowIcon /> : null}
    </Link>
  );
}
