import { Button } from "./ui/Button";

/*
 * Hero photo treatment is load-bearing per the design handoff (§Hero, §Implementation Notes).
 * Filter stack: grayscale(1) brightness(0.85) contrast(1.05) + mix-blend-mode: luminosity + opacity 0.75
 * Navy multiply overlay on top; horizontal fade-to-navy on the left edge.
 * Do not simplify unless the handoff instructions change.
 */

export function Hero() {
  return (
    <section className="relative bg-navy text-white overflow-hidden min-h-[720px] flex items-stretch">
      {/* Photo layer */}
      <div
        className="absolute top-0 right-0 bottom-0 w-[60%] z-[1] max-[960px]:w-full max-[960px]:opacity-[0.55]"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-navy overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/photos/tristan-hoop.jpg"
            alt=""
            className="w-full h-full object-cover"
            style={{
              objectPosition: "center 30%",
              filter: "grayscale(1) brightness(0.85) contrast(1.05)",
              mixBlendMode: "luminosity",
              opacity: 0.75,
            }}
          />
          {/* Navy multiply overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(15,23,42,0.55) 0%, rgba(15,23,42,0.35) 50%, rgba(15,23,42,0.65) 100%)",
              mixBlendMode: "multiply",
            }}
          />
        </div>
        {/* Horizontal fade from navy on left edge */}
        <div
          className="absolute inset-0 pointer-events-none max-[960px]:hidden"
          style={{
            background:
              "linear-gradient(90deg, #0F172A 0%, #0F172A 18%, rgba(15,23,42,0.92) 32%, rgba(15,23,42,0.55) 55%, rgba(15,23,42,0.20) 80%, rgba(15,23,42,0.0) 100%)",
          }}
        />
        <div
          className="hidden max-[960px]:block absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(15,23,42,0.4) 0%, rgba(15,23,42,0.95) 80%)",
          }}
        />
      </div>

      {/* Content layer */}
      <div className="relative z-[2] w-full max-w-[var(--spacing-maxw)] mx-auto px-[var(--pad-x)] pt-[88px] pb-24 grid grid-cols-[1.1fr_1fr] gap-10 items-end max-[960px]:grid-cols-1 max-[960px]:pb-16">
        <div>
          <div className="mono-eyebrow inline-flex items-center gap-[10px] text-blue-soft mb-7">
            <span className="inline-block w-6 h-px bg-blue-soft" aria-hidden="true" />
            Youth Basketball Training · Grades 3–5
          </div>
          <h1
            className="display m-0 mb-7"
            style={{ fontSize: "clamp(64px, 9vw, 132px)" }}
          >
            <span className="block">Start the</span>
            <span className="block">Game the</span>
            <span className="block">
              <span className="text-blue-soft">Right</span> Way.
            </span>
          </h1>
          <p className="max-w-[520px] text-[17px] leading-[1.5] text-white/[0.78] m-0 mb-9">
            We help young players build confidence and learn the fundamentals of
            basketball in a structured, encouraging environment.
          </p>
          <div className="flex gap-[14px] flex-wrap">
            <Button href="/book">Book a Session</Button>
            <Button href="#programs" variant="ghost" withArrow={false}>
              View Programs
            </Button>
          </div>
        </div>

        <div className="self-end grid grid-cols-2 gap-6 border-t border-white/[0.16] pt-7 mt-20">
          <MetaCell label="Ages" value="3rd – 5th" />
          <MetaCell label="Sessions" value="From $25" />
          <MetaCell label="Skill Level" value="All Welcome" />
          <MetaCell label="Focus" value="Fundamentals" />
        </div>
      </div>
    </section>
  );
}

function MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-blue-soft text-[11px] tracking-[0.14em] uppercase mb-[6px] font-mono">
        {label}
      </div>
      <div className="font-display text-[26px] uppercase tracking-[0.02em]">
        {value}
      </div>
    </div>
  );
}
