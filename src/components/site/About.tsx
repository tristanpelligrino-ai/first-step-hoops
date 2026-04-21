import { SectionEyebrow } from "./ui/SectionEyebrow";

export function About() {
  return (
    <section id="about" className="bg-white text-ink" style={{ paddingBlock: "clamp(72px, 9vw, 128px)" }}>
      <div className="container-fsh">
        <div className="grid grid-cols-2 gap-20 items-start max-[860px]:grid-cols-1 max-[860px]:gap-10">
          <div>
            <SectionEyebrow tone="blue" className="mb-[18px]">
              About the Program
            </SectionEyebrow>
            <h2
              className="display m-0 max-w-[14ch] text-ink"
              style={{ fontSize: "clamp(44px, 6vw, 84px)" }}
            >
              A Strong Foundation Changes Everything.
            </h2>
          </div>
          <div>
            <p className="text-[17px] text-gray-700 m-0 mb-[18px]">
              At First Step Hoops, we focus on what matters most early on—learning the game the right way.
            </p>
            <p className="text-[17px] text-gray-700 m-0 mb-[18px]">
              Our sessions are designed to help young players understand how basketball actually works, while building the skills they need to feel confident on the court.
            </p>
            <p className="text-[17px] text-gray-700 m-0 mb-[18px]">
              We don&apos;t rush development. We don&apos;t create pressure. We create an environment where kids can learn, improve, and enjoy the game.
            </p>
            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-gray-200 pt-7">
              <Stat value="5" label="Core skills" />
              <Stat value="3–5" label="Grade range" />
              <Stat value="0" label="Pressure" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-[44px] leading-none text-navy mb-[6px]">
        {value}
      </div>
      <div className="text-[12px] text-gray-500 tracking-[0.04em] uppercase font-mono">
        {label}
      </div>
    </div>
  );
}
