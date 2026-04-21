# Handoff: First Step Hoops — Marketing Homepage

## Overview

Single-page marketing site for **First Step Hoops**, a youth basketball training business (grades 3–5). The homepage is an editorial-sports-magazine treatment — bold condensed display type, structured navy/blue/orange palette, photo of the trainer as atmospheric hero background, testimonials, skills grid, about, coach bio, program pricing, and final CTA.

## About the Design Files

The files in this bundle are **design references created in HTML** — a high-fidelity prototype showing the intended look, copy, and interaction behavior. They are **not production code to copy directly.**

Your job is to **recreate this design in the target codebase's existing environment** (React, Next.js, Astro, whatever the client's real stack is) using that codebase's established component patterns, styling approach (CSS modules, Tailwind, styled-components, etc.), and conventions. If no codebase exists yet, pick the most appropriate framework for a marketing site (Next.js or Astro recommended) and implement there.

## Fidelity

**High-fidelity.** Final colors, typography, spacing, photography treatment, and copy are all locked. Recreate pixel-perfectly, then adapt to the target framework's idioms.

## Files in this bundle

- `First Step Hoops.html` — the source HTML prototype with tweak system still wired in. Read this to see exact structure, class names, and CSS.
- `First Step Hoops - Standalone.html` — self-contained bundled version with photos inlined; use as a visual reference.
- `assets/tristan-hoop.jpg` — hero background photo (desaturated + navy-tinted via CSS).
- `assets/tristan-shot.jpg` — coach portrait for the "Meet Tristan" section.
- `assets/basketball.jpg`, `assets/shoes.jpg` — secondary photography (currently unused but provided).

## Design Tokens

### Colors

```
--navy:       #0F172A    /* dominant background, nav, hero, footer */
--navy-2:     #131c33    /* subtle navy variant */
--navy-3:     #1b2742    /* subtle navy variant */
--blue:       #2563EB    /* primary CTA, accent mark in logo */
--blue-soft:  #3b82f6    /* hero headline highlight ("RIGHT") */
--orange:     #F97316    /* section eyebrows, small moments only (reserved) */
--white:      #FFFFFF
--gray-50:    #F8FAFC
--gray-100:   #F1F5F9
--gray-200:   #E5E7EB    /* hairlines, dividers */
--gray-400:   #94a3b8
--gray-500:   #64748b
--gray-700:   #334155    /* body copy on light */
--ink:        #0F172A    /* body copy on light, same as navy */
```

**Color roles (locked, do not shuffle):**
- **Navy** = dominant surface. Hero, nav, footer, final CTA.
- **Blue (`--blue`)** = primary action color. All `.btn-primary` backgrounds, the logo underscore `_`, hero eyebrow rules, stat numbers.
- **Orange** = reserved accent. Currently only used in section eyebrows (`Get Started`, etc). Do not use orange on large areas.
- **Grays** = light-surface body copy, dividers, subdued chrome.

### Typography

Loaded from Google Fonts:

```
Anton            — display headlines only (condensed sans, all caps)
Inter            — body, UI, buttons (400/500/600/700)
JetBrains Mono   — eyebrows, monospace accents (400/500)
Space Grotesk    — wordmark / logo only (400/500/600/700)
```

**Type scale / usage:**
- **Display** (`.display`): `font-family: Anton`, `letter-spacing: 0.005em`, `line-height: 0.92`, uppercase. Used for every H1/H2 on the page.
- **Hero title**: `clamp(64px, 9vw, 132px)`
- **Section H2**: roughly `clamp(44px, 6vw, 84px)` — match per-section values in the source.
- **Body**: Inter 400/500, 16–17px, `line-height: 1.55`.
- **Eyebrow** (`.mono` / `.section-eyebrow`): JetBrains Mono, 11px, `letter-spacing: 0.12em`, uppercase, colored orange or blue depending on section.
- **Wordmark** (`.wordmark`): Space Grotesk 700, 20px in nav, lowercase. Rendered as `first<span class="us">_</span>step hoops` with the underscore in `--blue`.

### Layout

```
--maxw:   1280px            /* content max width */
--pad-x:  clamp(20px, 4vw, 56px)  /* horizontal padding */
```

All major sections wrap content in `.container { max-width: var(--maxw); margin: 0 auto; padding: 0 var(--pad-x) }`.

### Buttons

```css
.btn {
  height: 44px; padding: 0 20px;
  border-radius: 2px;  /* very square — editorial, not rounded */
  font-family: Inter; font-size: 13px; font-weight: 600;
  letter-spacing: 0.06em; text-transform: uppercase;
}
.btn-primary { background: var(--blue); color: var(--white); }
.btn-ghost   { background: transparent; color: var(--white); border: 1px solid rgba(255,255,255,0.25); }
.btn-dark    { background: var(--navy); color: var(--white); }
```

Every primary button has a trailing right-arrow SVG: `<svg viewBox="0 0 14 10"><path d="M1 5h12m-4-4 4 4-4 4" stroke="currentColor" stroke-width="1.6"/></svg>`.

## Page Structure

The homepage has these sections in order. Each is marked with an HTML comment in the source.

### 1. NAV — `<header class="nav">`
- Sticky at top, navy background, 72px tall.
- Left: wordmark (`first_step hoops`, underscore in blue).
- Center: nav links `About · Skills · Coach · Programs` (13px, weight 500, 78% white).
- Right: `Book a Session` button (blue primary).

### 2. HERO — `<section class="hero">`
- Full-width, min-height ~720px, navy background.
- **Background:** `assets/tristan-hoop.jpg` positioned right 60% of hero, with these filters layered:
  - `filter: grayscale(1) brightness(0.85) contrast(1.05)`
  - `mix-blend-mode: luminosity`, `opacity: 0.75`
  - Plus a navy gradient overlay (`linear-gradient(180deg, rgba(15,23,42,0.55), rgba(15,23,42,0.35) 50%, rgba(15,23,42,0.65))`) with `mix-blend-mode: multiply`.
  The photo reads as atmosphere, not a feature image.
- **Grid:** two-column (1.1fr / 1fr), content left, empty (bleeds into photo) on right.
- **Eyebrow** (blue): `── YOUTH BASKETBALL TRAINING · GRADES 3–5`
- **Headline** (Anton, white, ~132px):
  ```
  START THE
  GAME THE
  [RIGHT] WAY.    ← "RIGHT" in --blue-soft
  ```
- **Subhead:** 17px body, 78% white, max 520px.
  > We help young players build confidence and learn the fundamentals of basketball in a structured, encouraging environment.
- **CTAs:** `Book a Session` (primary blue) + `View Programs` (ghost).
- **Meta bar** at bottom (4 cells, top border): AGES `3RD – 5TH` · SESSIONS `FROM $25` · SKILL LEVEL `ALL WELCOME` · FOCUS `FUNDAMENTALS`. Labels are mono 11px blue eyebrows; values are Anton 26px.

### 3. TESTIMONIALS — `<section class="testimonials">`
- Light background.
- H2: "Trusted by the coaches who know him." (Anton, display)
- Three quote cards in a grid. Each card: italicized quote, attribution (name + role), small divider.

### 4. ABOUT — `<section class="about">`
- H2: "A Strong Foundation Changes Everything."
- Two-column: body paragraphs + pull quote or image.

### 5. SKILLS — `<section class="skills">`
- H2: "Core Skills Every Player Needs."
- 4-column grid. Each skill card has a big Anton numeral (`01`, `02`…) in blue, a short title, and 1–2 lines of description.

### 6. WHY — `<section class="why">`
- H2: "Built for Early Development."
- 3 `why-card`s, each with a blue numeral, title, body.

### 7. COACH — `<section class="coach">`
- Navy background.
- H2: "Meet Tristan."
- Two-column: `assets/tristan-shot.jpg` left (framed, small badge), bio + pull quote right. Pull quote has a blue left border.

### 8. PROGRAMS — `<section class="programs">`
- Light background.
- H2: "Training Options."
- Three pricing cards. Middle card has a "Best Value" ribbon (blue). Each card: name, `$` + big Anton price, unit (mono eyebrow), description, feature list with custom bullet, `View Availability` CTA.

### 9. FINAL CTA — `<section class="final-cta">`
- Navy background, centered content.
- Orange eyebrow: `Get Started` (one of the rare orange uses)
- H2: "Give Your Child the **Right** Start." ("Right" in blue-soft)
- `Book a Session` + `See Programs` CTAs.
- Trust microcopy row at bottom.

### 10. FOOTER — `<footer>`
- Navy background.
- Wordmark left, copyright right.

## Interactions & Behavior

- Nav is sticky (`position: sticky; top: 0`).
- Nav links scroll-to in-page anchors (`#about`, `#skills`, `#coach`, `#programs`).
- Buttons have a subtle lift on hover: `transform: translateY(-1px)` over 150ms.
- Program card CTAs link to a future `/book.html?plan=<id>` route — currently stubbed.
- No modals, no client-side routing.

## Responsive Behavior

- Desktop breakpoint for nav links: hidden below 760px (`.nav-links { display:none }`).
- Hero grid collapses to single column at similar breakpoint.
- Program cards stack vertically on mobile.
- Hero headline uses `clamp()` so it scales fluidly.

## Assets

- Hero + coach photos are the trainer (Tristan). Source photos are in `assets/`.
- No icon set used beyond one inline right-arrow SVG on buttons.
- No external logos or third-party imagery.

## Tweaks System (in the prototype only)

The HTML includes a `#tweaks` panel with toggles for Hero Variant, Accent Color, and Wordmark Case. **Do not port this.** It exists only for design review. The locked production values are:
- `data-hero="a"` (photo hero)
- `data-accent="blue"`
- `data-wm="lower"` (lowercase `first_step hoops`)

Strip `#tweaks`, the `data-*` attributes, the `TWEAK_DEFAULTS` script, and all `body[data-accent=...]` CSS selectors. The page should ship with just the blue-accent styles applied directly.

## Implementation Notes

- **Photography:** The hero photo treatment (luminosity blend + navy multiply) is load-bearing. If you port to a different photo or asset pipeline, replicate the filters exactly or the hero will look wrong.
- **Type choice:** Anton is the brand voice. Don't substitute with Oswald or Bebas Neue casually — Anton's x-height and weight are what gives the page its sports-editorial feel.
- **Border radius is 2px**, not 4/6/8. Square-ish corners are intentional (editorial, not webby).
- **Orange is rare.** When in doubt, use blue for accents. Orange only appears in 1–2 section eyebrows total.

## Recommended Stack (if greenfield)

- **Next.js 14 (App Router)** or **Astro 4** for a static marketing site.
- **Tailwind CSS** with the design tokens above mapped into `tailwind.config`.
- **next/font** or Astro's font loading for Anton, Inter, JetBrains Mono, Space Grotesk.
- **next/image** for the hero photo with the CSS filters still applied via a wrapper.
