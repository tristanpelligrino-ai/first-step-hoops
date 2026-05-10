import { SectionEyebrow } from "./ui/SectionEyebrow";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  avatar: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "Tristan played for me in the Deep Run program for two years and was one of the hardest-working and most dedicated young men we've had. I also had the pleasure of teaching him in math class, where he showed the same work ethic and commitment he brought to the court. He is an outstanding young man with incredible character.",
    name: "Coach Doug Bibby",
    role: "Varsity Basketball Coach · Deep Run High School",
    avatar: "DB",
  },
  {
    quote:
      "Tristan played a vital role in helping our team win the conference this year. His work ethic and love of basketball is second to none on our team. Always wanting to learn and get better! Your kid will be in great hands if they want to learn how to work hard but also have a lot of fun! I plan on him working out my own kids this summer.",
    name: "Coach Chris Hamner",
    role: "Varsity Basketball Coach · Blessed Sacrament Huguenot",
    avatar: "CH",
  },
  {
    quote:
      "Tristan is entering his third summer working at the Bob Foley Basketball Camps and continues to be a conscientious and dependable staff member. He arrives each day enthusiastic and prepared to teach. His passion for working with kids is evident, as he is both patient and genuinely enjoys helping them learn and grow in the game of basketball.",
    name: "Ms. Louise Foley",
    role: "Bob Foley Next Level Basketball Camp",
    avatar: "LF",
  },
];

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="bg-gray-50 text-ink border-y border-gray-200"
      style={{ paddingBlock: "clamp(64px, 7vw, 96px)" }}
    >
      <div className="container-fsh">
        <div className="flex items-end justify-between gap-10 mb-12 flex-wrap">
          <div>
            <SectionEyebrow tone="blue" className="mb-3">
              What Coaches Say
            </SectionEyebrow>
            <h2
              className="display m-0 max-w-[16ch]"
              style={{ fontSize: "clamp(36px, 4.5vw, 56px)", lineHeight: "0.95" }}
            >
              Trusted by the coaches who know him.
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-3 max-[900px]:grid-cols-1 border-t border-l border-gray-200">
          {testimonials.map((t, i) => (
            <article
              key={i}
              className="relative flex flex-col bg-white border-r border-b border-gray-200 p-[36px_28px_32px]"
            >
              <div
                className="font-display text-orange"
                style={{ fontSize: "60px", lineHeight: "0.7", marginBottom: "12px" }}
              >
                &ldquo;
              </div>
              <blockquote
                className="m-0 mb-6 font-display text-navy"
                style={{
                  fontSize: "22px",
                  lineHeight: "1.2",
                  letterSpacing: "0.005em",
                  textTransform: "none",
                }}
              >
                {t.quote}
              </blockquote>
              <div className="mt-auto pt-5 border-t border-gray-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-navy text-white font-display text-base flex items-center justify-center tracking-[0.04em] shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-[14px] font-semibold text-navy mb-[2px]">
                    {t.name}
                  </div>
                  <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-gray-500">
                    {t.role}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
