import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

/** Shared shell + typography for the Privacy Policy and Terms of Service pages. */
export function LegalPage({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <main
        className="bg-white text-ink"
        style={{ paddingBlock: "clamp(72px, 9vw, 128px)" }}
      >
        <div className="container-fsh max-w-[720px]">
          <h1
            className="display text-ink m-0 mb-3"
            style={{ fontSize: "clamp(44px, 6vw, 72px)" }}
          >
            {title}
          </h1>
          <p className="text-gray-500 text-[13px] mb-10 font-mono">
            Last updated: {lastUpdated}
          </p>
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}

export function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-semibold text-ink text-[19px] mt-10 mb-2">{children}</h2>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-gray-700 text-[15px] leading-relaxed mb-4">{children}</p>
  );
}

export function UL({ children }: { children: React.ReactNode }) {
  return (
    <ul className="list-disc pl-5 mb-4 space-y-1.5 text-gray-700 text-[15px] leading-relaxed marker:text-gray-400">
      {children}
    </ul>
  );
}
