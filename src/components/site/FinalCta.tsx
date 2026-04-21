import { SectionEyebrow } from "./ui/SectionEyebrow";
import { Button } from "./ui/Button";

export function FinalCta() {
  return (
    <section className="relative bg-navy text-white overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        aria-hidden="true"
        style={{
          background:
            "repeating-linear-gradient(135deg, rgba(255,255,255,0.025) 0 16px, rgba(255,255,255,0) 16px 32px)",
        }}
      />
      <div
        className="container-fsh relative z-[2]"
        style={{ paddingBlock: "clamp(80px, 10vw, 160px)" }}
      >
        <div className="grid grid-cols-[1.4fr_1fr] gap-[60px] items-end max-[860px]:grid-cols-1">
          <div>
            <SectionEyebrow tone="orange" className="mb-[18px]">
              Get Started
            </SectionEyebrow>
            <h2
              className="display m-0 mb-6"
              style={{ fontSize: "clamp(56px, 9vw, 128px)", lineHeight: "0.92" }}
            >
              Give Your Child the <span className="text-blue-soft">Right</span> Start.
            </h2>
            <p className="text-[18px] text-white/[0.78] max-w-[36ch] m-0 mb-8">
              Build confidence, learn the game, and enjoy the process.
            </p>
            <div className="flex gap-[14px] flex-wrap">
              <Button href="/book">Book a Session</Button>
              <Button href="#programs" variant="ghost" withArrow={false}>
                See Programs
              </Button>
            </div>
            <div className="flex gap-7 flex-wrap text-white/60 font-mono text-[12px] tracking-[0.08em] uppercase mt-7">
              <MicroItem>Simple Scheduling</MicroItem>
              <MicroItem>Secure Online Payment</MicroItem>
              <MicroItem>Flexible Sessions</MicroItem>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MicroItem({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="inline-block bg-blue-soft"
        style={{ width: 6, height: 6 }}
        aria-hidden="true"
      />
      {children}
    </span>
  );
}
