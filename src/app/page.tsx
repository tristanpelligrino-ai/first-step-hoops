import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Testimonials } from "@/components/site/Testimonials";
import { About } from "@/components/site/About";
import { Skills } from "@/components/site/Skills";
import { Why } from "@/components/site/Why";
import { Coach } from "@/components/site/Coach";
import { Programs } from "@/components/site/Programs";
import { FinalCta } from "@/components/site/FinalCta";
import { Footer } from "@/components/site/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Testimonials />
        <About />
        <Skills />
        <Why />
        <Coach />
        <Programs />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
