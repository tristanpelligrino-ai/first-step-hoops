export function SectionEyebrow({
  children,
  tone = "blue",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "blue" | "orange";
  className?: string;
}) {
  const color = tone === "orange" ? "text-orange" : "text-blue";
  const bar = tone === "orange" ? "bg-orange" : "bg-blue";
  return (
    <div
      className={`mono-eyebrow inline-flex items-center gap-[10px] ${color} ${className}`}
    >
      <span className={`inline-block w-6 h-px ${bar}`} aria-hidden="true" />
      {children}
    </div>
  );
}
