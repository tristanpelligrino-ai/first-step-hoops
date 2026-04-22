"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  variant = "primary",
}: {
  children: React.ReactNode;
  variant?: "primary" | "danger" | "ghost";
}) {
  const { pending } = useFormStatus();
  const base =
    "h-11 px-5 rounded-btn text-[13px] font-semibold uppercase tracking-[0.06em] transition-colors disabled:opacity-60 disabled:cursor-wait";
  const variants = {
    primary: "bg-blue hover:bg-blue-soft text-white",
    danger: "bg-orange hover:bg-[#ff8a3a] text-navy",
    ghost: "bg-transparent border border-white/25 hover:border-white text-white",
  };
  return (
    <button type="submit" disabled={pending} className={`${base} ${variants[variant]}`}>
      {pending ? "Working…" : children}
    </button>
  );
}
