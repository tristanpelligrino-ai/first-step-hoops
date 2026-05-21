# First Step Hoops — Technical Build Spec

**Status:** v1 scope, locked pending implementation
**Last updated:** 2026-04-20

---

## 1. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 14 (App Router) | Marketing + booking + admin in one app |
| Styling | Tailwind CSS | Design tokens mapped from Claude Design handoff |
| Fonts | next/font | Anton, Inter, JetBrains Mono, Space Grotesk |
| Database | Postgres (Neon) | Managed, serverless-friendly |
| ORM | Drizzle | Lighter than Prisma, works well with Next.js edge + serverless |
| Payments | Stripe | Checkout Sessions + webhooks |
| Email | Resend | Magic links, receipts, reminders, manual sends |
| SMS | Twilio | Automated reminders/confirmations only |
| Hosting | Vercel | Includes cron jobs for scheduled tasks |
| Admin auth | bcrypt + iron-session | Username/password → signed session cookie |
| Customer identity | Email + magic link | No password, no dashboard |

---

## 2. Data Model

```ts
// Customer side
User {
  id: uuid
  email: string  // unique, lowercased
  phone: string  // E.164 format
  full_name: string
  created_at: timestamp
}

Player {
  id: uuid
  user_id: uuid → User
  name: string
  grade: enum('3rd', '4th', '5th', 'other')
  experience_notes: text
  medical_notes: text
  created_at: timestamp
}

// Scheduling
Slot {
  id: uuid
  starts_at: timestamp
  duration_min: int  // default 50
  location: string
  status: enum('open', 'booked', 'canceled')
  is_private: bool  // true = hidden from public booking, admin-created for siblings
  capacity: int  // default 1, higher for private sibling slots
  created_at: timestamp
  created_by: uuid → AdminUser
}

Booking {
  id: uuid
  slot_id: uuid → Slot
  user_id: uuid → User
  player_id: uuid → Player
  status: enum('scheduled', 'delivered', 'no_show', 'canceled')
  paid_with: enum('single_purchase', 'credit', 'private_invoice')
  stripe_payment_intent_id: string | null
  credit_id: uuid | null → Credit
  signed_waiver_id: uuid → SignedWaiver
  custom_price_cents: int | null  // for private bookings
  admin_notes: text
  created_at: timestamp
  status_changed_at: timestamp
  status_changed_by: uuid | null → AdminUser
}

// Credits
CreditPack {
  id: uuid
  user_id: uuid → User
  purchased_at: timestamp
  expires_at: timestamp  // purchased_at + 60 days
  total_credits: int  // 4 for a 4-pack
  stripe_payment_intent_id: string
  amount_paid_cents: int
}

Credit {
  id: uuid
  credit_pack_id: uuid → CreditPack
  status: enum('available', 'consumed', 'returned', 'expired', 'restored')
  consumed_by_booking_id: uuid | null → Booking
  status_changed_at: timestamp
  status_changed_by: uuid | null → AdminUser
}

// Waiver
WaiverVersion {
  id: uuid
  version: string  // e.g. "v1", "v2"
  body_md: text  // markdown source of legal text
  effective_from: timestamp
  is_current: bool
}

SignedWaiver {
  id: uuid
  waiver_version_id: uuid → WaiverVersion
  user_id: uuid → User
  player_id: uuid → Player
  typed_name: string
  signed_at: timestamp
  ip_address: string
  user_agent: string
}

// Magic links
MagicLinkToken {
  id: uuid
  user_id: uuid → User
  token_hash: string  // sha256 of the token; raw token never stored
  purpose: enum('apply_credit', 'view_bookings')
  expires_at: timestamp  // 15 min from creation
  used_at: timestamp | null
}

// Admin
AdminUser {
  id: uuid
  username: string  // unique
  password_hash: string  // bcrypt
  created_at: timestamp
  last_login_at: timestamp
}

AdminSession {
  // Handled by iron-session in signed cookie, no DB row needed
}

// Audit (optional v1, recommended for v1.1)
AuditLog {
  id: uuid
  actor_type: enum('admin', 'customer', 'system')
  actor_id: uuid | null
  action: string  // e.g. 'booking.refunded', 'credit.restored'
  target_type: string
  target_id: uuid
  metadata: jsonb
  created_at: timestamp
}
```

### Indexes
- `User.email` unique
- `Slot.starts_at` for calendar queries
- `Slot(status, is_private, starts_at)` for public slot listing
- `Booking.slot_id`, `Booking.user_id`, `Booking.status`
- `Credit(user_id, status, expires_at)` via join to CreditPack for "available credits for user" query
- `MagicLinkToken.token_hash` unique

---

## 3. Pages

### 3.1 Public

| Route | Purpose |
|---|---|
| `/` | Marketing homepage (port of Claude Design HTML) |
| `/book` | Step 1 — plan picker (Single vs 4-pack) |
| `/book/slots?plan=single\|pack` | Step 2 — slot picker (calendar view of open public slots) |
| `/book/details?slot=<id>&plan=<p>` | Step 3 — parent info + player info + waiver |
| `/book/checkout` | Redirect to Stripe Checkout |
| `/book/confirm?session_id=<stripe>` | Post-payment confirmation, summary |
| `/credits/request` | Returning customer enters email → magic link sent |
| `/credits/apply?token=<t>` | Magic link landing → show balance + slot picker → apply credit |
| `/privacy` | Privacy policy (legal text from attorney) |
| `/terms` | Terms of service (legal text from attorney) |

### 3.2 Admin

| Route | Purpose |
|---|---|
| `/admin/login` | Username + password |
| `/admin` | Dashboard — today's sessions, upcoming week at a glance |
| `/admin/calendar` | Full calendar view — slots, bookings overlaid |
| `/admin/slots` | Slot list (upcoming + past) |
| `/admin/slots/new` | Create slot (date, time, duration, location, private flag) |
| `/admin/slots/[id]` | Edit / cancel slot |
| `/admin/bookings` | Booking list with filters (status, date range) |
| `/admin/bookings/[id]` | Booking detail — mark delivered/no-show/canceled, refund, reschedule, view waiver, view medical notes |
| `/admin/bookings/new-private` | Create private (sibling) booking — pick date/time/location, enter kids, set custom price, generate Stripe link |
| `/admin/customers` | User list with search |
| `/admin/customers/[id]` | Customer detail — players, booking history, credit balance + expiry, restore credit, send manual email |
| `/admin/waivers` | Signed waiver list + PDF export per waiver |
| `/admin/settings/waiver` | Publish new waiver version (markdown editor) |

---

## 4. API Routes

### 4.1 Public

```
POST   /api/booking/create-checkout
  body: { plan: 'single'|'pack', slot_id, user_info, player_info, waiver_accepted, typed_name }
  → creates User+Player+SignedWaiver (pending booking), returns Stripe Checkout URL

POST   /api/booking/apply-credit
  body: { token, slot_id, player_id }
  → verifies magic link token, consumes credit, creates booking

POST   /api/magic-link/request
  body: { email }
  → sends magic link via Resend, rate-limited 1/min per email

POST   /api/stripe/webhook
  → handles: checkout.session.completed, charge.refunded, payment_intent.payment_failed
```

### 4.2 Admin (all require admin session)

```
POST   /api/admin/login                     body: { username, password }
POST   /api/admin/logout

GET    /api/admin/slots?from=&to=
POST   /api/admin/slots                     body: { starts_at, duration_min, location, is_private, capacity }
PATCH  /api/admin/slots/[id]
DELETE /api/admin/slots/[id]                (soft cancel if has bookings)

GET    /api/admin/bookings?status=&from=&to=
GET    /api/admin/bookings/[id]
PATCH  /api/admin/bookings/[id]/status      body: { status: 'delivered'|'no_show'|'canceled', return_credit?: bool }
POST   /api/admin/bookings/[id]/reschedule  body: { new_slot_id }
POST   /api/admin/bookings/[id]/refund      body: { amount_cents?, void_credits?: bool }

POST   /api/admin/bookings/private
  body: { starts_at, location, kids: [{name, grade, ...}], parent: {...}, price_cents }
  → creates slot (is_private=true), booking(s), Stripe payment link, sends link via SMS/email

GET    /api/admin/customers?search=
GET    /api/admin/customers/[id]
POST   /api/admin/credits/[id]/restore      body: { new_expiry?: timestamp }
POST   /api/admin/customers/[id]/email      body: { subject, body }

GET    /api/admin/waivers
GET    /api/admin/waivers/[id]/pdf
POST   /api/admin/waiver-versions           body: { body_md }  (publishes new version, marks others not-current)

POST   /api/admin/cron/expire-credits       (cron-only, secured by CRON_SECRET header)
POST   /api/admin/cron/send-reminders
POST   /api/admin/cron/expiring-credits-warning
```

---

## 5. Stripe Integration

### 5.1 Checkout flow (single session)
1. Frontend collects user/player/waiver info, POSTs to `/api/booking/create-checkout`
2. Backend creates `User`, `Player`, `SignedWaiver` records in DB (status = pending/unpaid)
3. Backend creates a `Booking` in `scheduled` state but with `stripe_payment_intent_id = null`, slot held with a short TTL lock
4. Backend creates Stripe Checkout Session with `metadata: { booking_id, plan: 'single' }`
5. Returns URL, frontend redirects
6. On success webhook → booking marked paid, `stripe_payment_intent_id` set, slot moved to `booked`
7. On expiration/failure → booking deleted, slot released

### 5.2 Checkout flow (4-pack)
Same as above, but metadata includes `plan: 'pack'`. On webhook success:
- Create `CreditPack` row with `total_credits: 4`, `expires_at: now + 60d`
- Create 4 `Credit` rows, status `available`
- **Consume the first credit** on the booking they made at checkout (the one they committed to)
- Remaining 3 credits available for future bookings via magic link

### 5.3 Private booking (admin-generated)
1. Admin fills form → backend creates `Slot(is_private: true)`, `Booking(paid_with: 'private_invoice', status: 'scheduled')`
2. Backend creates a Stripe **Payment Link** (not Checkout Session) with the custom price
3. Link sent to parent via SMS (Twilio) + email (Resend)
4. On `charge.succeeded` webhook for that link → booking marked paid

### 5.4 Refunds
- Admin clicks "Refund" on booking detail
- Backend calls `stripe.refunds.create({ payment_intent: booking.stripe_payment_intent_id })`
- Updates booking status to `canceled`
- If `void_credits: true` (for 4-pack refund), mark all associated credits as `expired` or delete the CreditPack

### 5.5 Webhook events to handle
```
checkout.session.completed   → finalize booking, create credits if pack
charge.refunded              → update booking status, update audit log
payment_intent.payment_failed → release slot, mark booking as failed
```

Webhooks signed with `STRIPE_WEBHOOK_SECRET`, signature verified on every call.

---

## 6. Waiver Flow

### Collection (at checkout, step 3)
- Display current `WaiverVersion.body_md` (rendered from markdown)
- User checks "I agree" + types full legal name
- On submit, create `SignedWaiver` with:
  - `waiver_version_id` = current version
  - `typed_name`
  - `signed_at` = now
  - `ip_address` from request headers (prefer `x-forwarded-for`, fall back to req.ip)
  - `user_agent` from headers
- Bind to the `Booking` via `Booking.signed_waiver_id`

### Versioning
- New waiver text = new `WaiverVersion` row, `is_current: true`, all others set false
- Old signed waivers remain bound to their original version — do not retroactively rebind
- If the same user books again and a new version exists since their last waiver, re-prompt (we show waiver on every booking for simplicity in v1, but bind only to current version)

### PDF export
- Admin clicks "Export PDF" → server generates PDF with:
  - Waiver text (from `WaiverVersion.body_md`)
  - Typed name, signed_at, IP, user-agent
  - Parent and player info as of signing
- Use `@react-pdf/renderer` or similar

---

## 7. Notifications

### 7.1 Automated SMS (Twilio)
| Trigger | Recipient | Content |
|---|---|---|
| Booking confirmed | Parent | "Booked: [day/time] at [location]. Reply to this number if you need to reschedule." |
| 24h before session | Parent | "Reminder: [player name]'s session tomorrow at [time], [location]." |
| Session canceled by admin | Parent | "Your session on [day] was canceled. [optional reason]. Your credit has been restored." |

### 7.2 Automated Email (Resend)
| Trigger | Recipient | Content |
|---|---|---|
| Magic link requested | Parent | Magic link (15-min expiry) |
| Booking confirmed | Parent | Receipt + session details + location + waiver PDF |
| 24h before session | Parent | Reminder with session details |
| 7 days before credit expiry | Parent (w/ unused credits) | "You have X credits expiring on [date]. Book here: [magic link]" |

### 7.3 Manual (admin → customer)
- Admin can send one-off emails via `/admin/customers/[id]` → "Send email" form
- Manual SMS NOT supported in admin; son uses personal phone for conversational texts

---

## 8. Cron Jobs (Vercel Cron)

Configured in `vercel.json`:

```json
{
  "crons": [
    { "path": "/api/admin/cron/expire-credits",           "schedule": "0 6 * * *" },
    { "path": "/api/admin/cron/send-reminders",           "schedule": "0 7 * * *" },
    { "path": "/api/admin/cron/expiring-credits-warning", "schedule": "0 19 * * *" }
  ]
}
```

All cron routes check `x-vercel-cron: 1` header + `CRON_SECRET` for defense in depth.

---

## 9. Environment Variables

```
# Database
DATABASE_URL=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=bookings@firststephoops.com

# Twilio
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Auth
ADMIN_SESSION_SECRET=       # 32+ chars random
MAGIC_LINK_SECRET=          # 32+ chars random, used to hash tokens

# App
NEXT_PUBLIC_APP_URL=https://firststephoops.com
CRON_SECRET=                # random, shared with vercel cron
```

---

## 10. Build Phases

Each phase is a shippable increment. Aim: working, demoable progress at the end of each.

**Phase 0 — Foundation**
- Next.js 14 scaffold, Tailwind config w/ design tokens from handoff
- Drizzle + Neon Postgres, first migration
- `vercel.json`, env var scaffolding, local `.env.example`

**Phase 1 — Marketing site**
- Port Claude Design HTML to Next.js + Tailwind components
- Legal pages (stub; real text pending attorney)
- Deploy to Vercel on firststephoops.com

**Phase 2 — Admin foundation**
- Admin login + session
- Admin layout shell
- Seed script for admin user
- Dashboard skeleton

**Phase 3 — Slot management**
- `/admin/slots` list + create + edit
- Calendar view

**Phase 4 — Public booking (single session only, no credits)**
- Plan picker → slot picker → details form (without waiver yet) → Stripe Checkout
- Stripe webhook handler for `checkout.session.completed`
- Confirmation page

**Phase 5 — Waiver**
- WaiverVersion + SignedWaiver models + admin UI to publish versions
- Waiver step in booking flow
- PDF export

**Phase 6 — 4-pack + credits**
- 4-pack plan option at checkout
- Credit creation on pack purchase
- Magic link flow: `/credits/request` → `/credits/apply` → book with credit
- Credit balance display

**Phase 7 — Admin booking management**
- Booking detail page
- Status transitions (delivered / no_show / canceled)
- Refund action (calls Stripe API)
- Reschedule action
- Restore credit action

**Phase 8 — Notifications**
- Resend integration (transactional emails)
- Twilio integration (confirmation + reminder SMS)
- Templates for each trigger in §7

**Phase 9 — Cron + automation**
- Expire-credits cron
- Reminder cron (24h before)
- Expiring-credits warning cron (7d before expiry)

**Phase 10 — Private / sibling booking**
- `/admin/bookings/new-private` form
- Stripe Payment Link generation
- Delivery via SMS + email

**Phase 11 — Polish**
- Audit log
- Legal pages with attorney-supplied text
- Error states, empty states, loading states
- Production hardening (rate limits, input validation sweep)

---

## 11. Security Checklist

- [ ] Admin login: bcrypt hash, rate-limit attempts (5/15min/IP)
- [ ] Admin session: iron-session signed cookies, `httpOnly`, `secure`, `sameSite: lax`
- [ ] Magic-link tokens: 256-bit random, stored as SHA-256 hash, 15-min TTL, single-use
- [ ] Stripe webhooks: signature verified on every call
- [ ] Cron routes: `x-vercel-cron` + `CRON_SECRET` check
- [ ] All admin API routes: session check middleware
- [ ] Medical notes: stored in DB with TLS in transit; consider app-layer encryption in v1.1
- [ ] Rate limit magic link requests (1/min/email, 10/hour/IP)
- [ ] Input validation: Zod schemas on every API route
- [ ] SQL injection: Drizzle's parameterized queries (no raw SQL in user paths)
- [ ] XSS: React default escaping; sanitize admin markdown (waiver text) with DOMPurify before render

---

## 12. Known Decisions Deferred to v1.1

- Audit log UI (data collected in v1, no viewer yet)
- App-layer encryption of medical notes
- Self-serve reschedule (customer-facing)
- Recurring / standing weekly slots (admin creates individual slots for now)
- Group sessions beyond sibling pairs
- Promo codes / discounts (sibling discount handled manually via custom price)
- Analytics dashboard (basic operational needs covered; no business metrics view)

---

## 13. Open Items Before Phase 1

1. **Attorney-drafted:** waiver text, privacy policy, terms of service (placeholders until then)
2. **Tristan:** form LLC (pending attorney advice), open business bank account, create Stripe account in parent's name
3. **Tristan:** provision Twilio phone number, verify sender domain in Resend (`firststephoops.com`)
4. **Tristan:** decide on Postgres host (Neon recommended for Vercel fit)
5. **Tristan:** background-check service for coach
6. **Tristan:** session location finalized (affects liability + what we put in slot defaults)
