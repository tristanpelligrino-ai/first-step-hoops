import { ImageResponse } from "next/og";

export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export const alt = "First Step Hoops — Youth Basketball Training · Grades 2–5";

async function loadGoogleFont(family: string, weight = 400) {
  // Google Fonts API v1 + non-browser UA serves TTF (Satori doesn't support WOFF2).
  const params = new URLSearchParams({ family: `${family}:${weight}` });
  const cssUrl = `https://fonts.googleapis.com/css?${params.toString()}`;
  const css = await fetch(cssUrl, {
    headers: { "User-Agent": "Wget/1.20" },
  }).then((r) => r.text());
  const match = css.match(/src:\s*url\((https:\/\/[^)]+)\)\s*format\('truetype'\)/);
  if (!match) throw new Error(`Could not find TTF for ${family}`);
  return fetch(match[1]).then((r) => r.arrayBuffer());
}

export default async function Image() {
  const [anton, mono] = await Promise.all([
    loadGoogleFont("Anton", 400),
    loadGoogleFont("JetBrains Mono", 500),
  ]);

  const NAVY = "#0f172a";
  const NAVY_3 = "#1b2742";
  const BLUE = "#3b82f6";
  const ORANGE = "#f97316";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_3} 100%)`,
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 72px",
            width: "100%",
            height: "100%",
            color: "#ffffff",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              fontFamily: "JetBrains Mono",
              fontSize: 22,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: BLUE,
            }}
          >
            <span style={{ width: 40, height: 2, background: BLUE }} />
            <span>Youth Basketball Training · Grades 2–5</span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: "Anton",
              fontSize: 196,
              lineHeight: 0.9,
              textTransform: "uppercase",
              letterSpacing: "-0.01em",
            }}
          >
            <div style={{ display: "flex" }}>First Step</div>
            <div style={{ display: "flex" }}>
              Hoops<span style={{ color: ORANGE }}>.</span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 36,
              paddingTop: 24,
              borderTop: "1px solid rgba(255,255,255,0.18)",
              fontFamily: "JetBrains Mono",
              fontSize: 20,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.88)",
            }}
          >
            <span>Ages 2nd – 5th</span>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>·</span>
            <span>From $25</span>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>·</span>
            <span>Fundamentals</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Anton", data: anton, style: "normal", weight: 400 },
        { name: "JetBrains Mono", data: mono, style: "normal", weight: 500 },
      ],
    }
  );
}
