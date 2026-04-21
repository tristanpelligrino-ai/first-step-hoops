import { SectionEyebrow } from "./ui/SectionEyebrow";
import { Button } from "./ui/Button";

export function Programs() {
  return (
    <section
      id="programs"
      className="bg-white text-ink"
      style={{ paddingBlock: "clamp(72px, 9vw, 128px)" }}
    >
      <div className="container-fsh">
        <div className="grid grid-cols-[1.2fr_1fr] gap-[60px] items-end mb-14 max-[860px]:grid-cols-1">
          <div>
            <SectionEyebrow tone="blue" className="mb-[18px]">
              Programs / Sessions
            </SectionEyebrow>
            <h2
              className="display m-0 max-w-[14ch] text-ink"
              style={{ fontSize: "clamp(44px, 6vw, 84px)" }}
            >
              Training Options.
            </h2>
          </div>
          <p className="max-w-[56ch] text-gray-700 text-[17px] m-0">
            Two simple ways to get started. Pay online, pick a time that works, and show up ready to learn.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 max-[760px]:grid-cols-1">
          <ProgramCard
            name="Single Session"
            price="25"
            unit="per session · 1 hour"
            description="A focused training session designed to introduce and reinforce core fundamentals."
            features={[
              "One 60-minute session",
              "Skill assessment included",
              "Take-home practice plan",
            ]}
            href="/book?plan=single"
            ctaVariant="dark"
          />
          <ProgramCard
            name="4-Pack"
            price="75"
            unit="4 sessions · save $25"
            description="A series of sessions that allows players to build consistency, improve skills, and gain confidence over time. Best for players who want to see real progress."
            features={[
              "Four 60-minute sessions",
              "Progress check-ins",
              "Flexible scheduling",
              "Parent updates after each session",
            ]}
            href="/book?plan=4pack"
            featured
            ctaVariant="primary"
          />
        </div>
      </div>
    </section>
  );
}

function ProgramCard({
  name,
  price,
  unit,
  description,
  features,
  href,
  featured = false,
  ctaVariant,
}: {
  name: string;
  price: string;
  unit: string;
  description: string;
  features: string[];
  href: string;
  featured?: boolean;
  ctaVariant: "dark" | "primary";
}) {
  const cardBg = featured
    ? "bg-navy text-white border-navy"
    : "bg-white text-ink border-gray-200 hover:border-navy";
  const nameColor = featured ? "text-white/60" : "text-gray-500";
  const unitColor = featured ? "text-white/[0.65]" : "text-gray-500";
  const bodyColor = featured ? "text-white/[0.78]" : "text-gray-700";
  const listBorder = featured ? "border-white/[0.14]" : "border-gray-200";

  return (
    <article
      className={`relative flex flex-col border p-9 transition-[border-color,transform] duration-150 hover:-translate-y-[2px] ${cardBg}`}
    >
      {featured && (
        <div className="absolute -top-px -right-px bg-blue text-white font-mono text-[10px] tracking-[0.14em] uppercase px-3 py-[6px]">
          Best Value
        </div>
      )}
      <div
        className={`font-mono text-[11px] tracking-[0.14em] uppercase mb-[18px] ${nameColor}`}
      >
        {name}
      </div>
      <div className="font-display leading-[0.9] m-0 mb-[6px] text-[88px] max-[760px]:text-[64px]">
        <span className="text-[32px] align-top mr-1 opacity-70">$</span>
        {price}
      </div>
      <div className={`text-[13px] mb-6 ${unitColor}`}>{unit}</div>
      <p className={`m-0 mb-6 text-[15px] ${bodyColor}`}>{description}</p>
      <ul className={`list-none p-0 m-0 mb-7 border-t ${listBorder}`}>
        {features.map((f) => (
          <li
            key={f}
            className={`flex items-center gap-[10px] py-3 text-[14px] border-b ${listBorder}`}
          >
            <span
              className="inline-block bg-orange shrink-0"
              style={{ width: 8, height: 8 }}
              aria-hidden="true"
            />
            {f}
          </li>
        ))}
      </ul>
      <div className="mt-auto">
        <Button href={href} variant={ctaVariant}>
          View Availability
        </Button>
      </div>
    </article>
  );
}
