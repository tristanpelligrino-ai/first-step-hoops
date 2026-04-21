import { SectionEyebrow } from "./ui/SectionEyebrow";

const skills = [
  { num: "01 / FOOTWORK", title: "Footwork", body: "Learn how to move with balance and control." },
  { num: "02 / SHOOTING", title: "Shooting", body: "Develop proper form and consistency." },
  { num: "03 / PASSING", title: "Passing", body: "Understand timing, spacing, and decision-making." },
  { num: "04 / DRIBBLING", title: "Dribbling", body: "Build confidence handling the ball under control." },
  { num: "05 / FINISHING", title: "Finishing", body: "Score around the basket with technique and touch." },
];

export function Skills() {
  return (
    <section
      id="skills"
      className="bg-navy text-white"
      style={{ paddingBlock: "clamp(72px, 9vw, 128px)" }}
    >
      <div className="container-fsh">
        <div className="grid grid-cols-[1.1fr_1fr] gap-[60px] items-end mb-16 max-[860px]:grid-cols-1 max-[860px]:gap-6">
          <div>
            <SectionEyebrow tone="orange" className="mb-[18px]">
              What Your Child Will Learn
            </SectionEyebrow>
            <h2
              className="display m-0 max-w-[14ch]"
              style={{ fontSize: "clamp(44px, 6vw, 84px)" }}
            >
              Core Skills Every Player Needs.
            </h2>
          </div>
          <p className="max-w-[56ch] text-white/[0.72] text-[17px] m-0">
            We break the game down into simple, teachable fundamentals that players can build on over time.
          </p>
        </div>

        <div className="grid grid-cols-5 max-[980px]:grid-cols-2 max-[520px]:grid-cols-1 border-t border-l border-white/[0.14]">
          {skills.map((s) => (
            <article
              key={s.num}
              className="relative flex flex-col justify-between p-[32px_24px_28px] min-h-[240px] border-r border-b border-white/[0.14] transition-colors hover:bg-white/[0.03]"
            >
              <div className="font-mono text-[11px] text-orange tracking-[0.14em]">
                {s.num}
              </div>
              <div>
                <h3 className="display font-normal text-[32px] leading-[0.95] mt-4 mb-[10px] tracking-[0.01em]">
                  {s.title}
                </h3>
                <p className="text-[14px] text-white/[0.72] m-0 leading-[1.5]">
                  {s.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
