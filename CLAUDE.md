@AGENTS.md

# First Step Hoops

Youth basketball training business — marketing site + custom booking/payment system + admin panel. Built for a minor operator (17yo coach) with a parent-owned LLC.

## Key docs in this repo

- `docs/spec.md` — full technical build spec (data model, pages, APIs, Stripe, waiver, cron, build phases). Start here for any feature work.
- `docs/first-step-hoops-vision.md` — brand, design system, homepage copy.
- `docs/attorney-overview.md` — business/legal overview prepared for attorney review.
- `docs/design_handoff/design_handoff_first_step_hoops/` — Claude Design HTML prototype + handoff README with design tokens, typography, section-by-section structure.

## Stack

- **Next.js 16** (App Router) — note: Node 20.9+ required, TS 5.1+, **all request APIs are async** (`cookies()`, `headers()`, `params`, `searchParams` all return Promises). Turbopack default.
- **React 19**
- **Tailwind CSS v4** — design tokens configured via `@theme` in `src/app/globals.css`, NOT in a `tailwind.config.js` (there is none).
- **Drizzle ORM** + **Neon Postgres** (`drizzle-orm/neon-http` driver)
- **Stripe** (Checkout Sessions + Payment Links + webhooks)
- **Resend** (email), **Twilio** (SMS)
- **iron-session** (admin auth), **bcryptjs** (admin password hashing)
- **zod** (input validation)
- Hosting: **Vercel** (with cron jobs — see `vercel.json`)

## Design system (locked — do not shuffle)

- Colors: navy dominant, blue primary action, orange rare accent only. Tokens defined in `globals.css`.
- Fonts: Anton (display, all caps), Inter (body/UI), JetBrains Mono (eyebrows), Space Grotesk (wordmark). Loaded via `next/font/google` in `src/app/layout.tsx` → exposed as `--font-anton`, `--font-inter`, `--font-jetbrains-mono`, `--font-space-grotesk` → mapped to `--font-display`/`--font-sans`/etc. in the `@theme` block.
- Border radius: 2px (editorial, not rounded).
- Full details: `docs/design_handoff/design_handoff_first_step_hoops/README.md`.

## Conventions

- Use dedicated tools (Read/Edit/Write/Glob/Grep) over shell commands.
- Server/client: default to Server Components; add `"use client"` only when needed.
- Request-time APIs are async — always `await cookies()`, `await props.params`, etc.
- Drizzle schema lives in `src/lib/db/schema.ts`. Regenerate migrations with `npm run db:generate`; push dev schema with `npm run db:push`.
- Validate every API route input with a zod schema before touching the DB.
- Env vars are validated in `src/lib/env.ts` — add new vars there.

## Scripts

- `npm run dev` — dev server (Turbopack)
- `npm run build` — production build
- `npm run typecheck` — tsc --noEmit
- `npm run lint` — eslint
- `npm run db:generate` — generate migration SQL from schema
- `npm run db:push` — push schema directly to DB (dev only)
- `npm run db:studio` — open Drizzle Studio
