import { SectionEyebrow } from "./ui/SectionEyebrow";

const reasons = [
  {
    num: "01",
    title: "Structured Coaching",
    body:
      "Every session is intentional and focused—built around clear progressions kids can actually follow.",
  },
  {
    num: "02",
    title: "Positive Environment",
    body:
      "Encouraging instruction that builds confidence, never pressure or comparison.",
  },
  {
    num: "03",
    title: "No Pressure, Just Progress",
    body:
      "Development over rankings or outcomes. We measure growth, not stats.",
  },
];

export function Why() {
  return (
    <section
      id="why"
      className="bg-white text-ink"
      style={{ paddingBlock: "clamp(72px, 9vw, 128px)" }}
    >
      <div className="container-fsh">
        <SectionEyebrow tone="blue" className="mb-[18px]">
          Why Parents Choose First Step Hoops
        </SectionEyebrow>
        <h2
          className="display m-0 mb-7 max-w-[14ch] text-ink"
          style={{ fontSize: "clamp(44px, 6vw, 84px)" }}
        >
          Built for Early Development.
        </h2>

        <div className="grid grid-cols-3 max-[860px]:grid-cols-1 mt-14 border-t-2 border-navy">
          {reasons.map((r, i) => (
            <div
              key={r.num}
              className={`bg-white p-[40px_28px_36px] border-b border-gray-200 ${i !== reasons.length - 1 ? "border-r border-gray-200" : ""}`}
            >
              <div className="font-display text-[20px] text-orange mb-[14px] inline-block">
                {r.num}
              </div>
              <h3 className="display font-normal text-[30px] m-0 mb-3 leading-none text-navy">
                {r.title}
              </h3>
              <p className="m-0 text-gray-700 text-[15px]">{r.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
