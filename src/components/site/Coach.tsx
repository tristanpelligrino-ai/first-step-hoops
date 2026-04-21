import { SectionEyebrow } from "./ui/SectionEyebrow";

export function Coach() {
  return (
    <section
      id="coach"
      className="bg-gray-50 text-ink border-y border-gray-200"
      style={{ paddingBlock: "clamp(72px, 9vw, 128px)" }}
    >
      <div className="container-fsh">
        <div className="grid grid-cols-[0.9fr_1.1fr] gap-20 items-center max-[860px]:grid-cols-1 max-[860px]:gap-10">
          <div className="relative aspect-[4/5] overflow-hidden bg-[#cdd5e3]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/photos/tristan-shot.jpg"
              alt="Coach Tristan in shooting form"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: "center top" }}
            />
            <div className="absolute top-5 -left-[10px] bg-blue text-white font-display text-[14px] uppercase tracking-[0.06em] px-[14px] py-2">
              Head Coach
            </div>
          </div>

          <div>
            <SectionEyebrow tone="blue" className="mb-[18px]">
              About the Coach
            </SectionEyebrow>
            <h2
              className="display m-0 mb-7 max-w-[14ch] text-ink"
              style={{ fontSize: "clamp(44px, 6vw, 84px)" }}
            >
              Meet Tristan.
            </h2>
            <p className="text-[17px] text-gray-700 m-0 mb-[18px]">
              Tristan is passionate about helping young players build a strong foundation in basketball.
            </p>
            <p className="text-[17px] text-gray-700 m-0 mb-[18px]">
              His approach focuses on teaching the fundamentals the right way, while creating a positive and encouraging environment where kids feel comfortable learning and improving.
            </p>
            <p className="text-[17px] text-gray-700 m-0 mb-[18px]">
              He believes that confidence comes from understanding the game—and that early development should be both structured and enjoyable.
            </p>
            <div
              className="mt-8 pl-5 border-l-[3px] border-blue font-display uppercase text-navy max-w-[18ch]"
              style={{ fontSize: "28px", lineHeight: "1.05" }}
            >
              &ldquo;Confidence comes from understanding the game.&rdquo;
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
