export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center">
      <div className="container-fsh text-center py-32">
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-blue mb-6">
          — Youth Basketball Training · Grades 3–5
        </p>
        <h1
          className="font-display uppercase text-white leading-[0.92]"
          style={{ fontSize: "clamp(64px, 9vw, 132px)" }}
        >
          START THE GAME
          <br />
          THE <span className="text-blue-soft">RIGHT</span> WAY.
        </h1>
        <p className="mt-10 text-sm font-mono uppercase tracking-[0.12em] text-gray-400">
          Phase 0 scaffold — marketing build in Phase 1
        </p>
      </div>
    </main>
  );
}
