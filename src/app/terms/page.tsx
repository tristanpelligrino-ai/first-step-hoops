import type { Metadata } from "next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export const metadata: Metadata = {
  title: "Terms of Service — First Step Hoops",
};

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main className="bg-white text-ink" style={{ paddingBlock: "clamp(72px, 9vw, 128px)" }}>
        <div className="container-fsh max-w-[720px]">
          <h1 className="display text-ink m-0 mb-8" style={{ fontSize: "clamp(44px, 6vw, 72px)" }}>
            Terms of Service
          </h1>
          <p className="text-gray-700 text-[17px]">
            Placeholder — final terms of service pending legal review.
          </p>
          <p className="text-gray-500 text-[14px] mt-6 font-mono">
            Last updated: {new Date().toISOString().slice(0, 10)}
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
