import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export default function BookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <main className="bg-navy text-white min-h-[calc(100vh-72px-150px)]">
        {children}
      </main>
      <Footer />
    </>
  );
}
