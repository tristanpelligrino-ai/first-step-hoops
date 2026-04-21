export function Wordmark({
  className = "",
  size = "nav",
}: {
  className?: string;
  size?: "nav" | "footer";
}) {
  const fontSize = size === "footer" ? "text-[18px]" : "text-[20px]";
  return (
    <span
      className={`inline-flex items-baseline font-wordmark font-bold tracking-[-0.01em] lowercase leading-none ${fontSize} ${className}`}
    >
      <span>first</span>
      <span className="text-blue">_</span>
      <span>step</span>
      <span>&nbsp;</span>
      <span>hoops</span>
    </span>
  );
}
