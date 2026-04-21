# First Step Hoops — Business & Legal Overview

**Prepared for attorney review**
**Date:** April 2026

---

## 1. Executive Summary

First Step Hoops is a youth basketball training business targeting 3rd–5th grade players. Sessions are one-on-one (with occasional sibling pairings). The business is being launched online via a custom website that handles booking, payment, and customer management.

**Key structural point:** The business will be **operated day-to-day by my 17-year-old son** (training delivery, scheduling, parent communication), but **owned and legally represented by me** (the parent) because he is a minor. I am seeking your guidance on how to structure this correctly.

---

## 2. The Business

### Services offered
- 50-minute one-on-one basketball training sessions
- Held at a pre-determined location set per session (likely rented gym space or similar; to be finalized)
- Target audience: parents of 3rd–5th grade youth players of all skill levels

### Pricing
- **Single session:** $25
- **4-session pack:** $75 (credits applied to future sessions, expiring 60 days from purchase)
- **Sibling / small-group sessions:** custom-priced on request

### Expected volume (initial)
- Low, hobby-to-part-time scale to start — single operator delivering sessions himself
- Scaling plans TBD pending launch traction

---

## 3. Operator / Owner Split

| Role | Person | Description |
|---|---|---|
| Owner / legal entity signer | Parent (me) | Forms and owns the business entity, signs the Stripe merchant account, holds the bank account, files taxes, signs insurance/waiver contracts |
| Operator / Coach | Son (age 17) | Delivers training sessions, manages the scheduling calendar through a custom admin panel, communicates with parents via SMS |

**Son turns 18 in [date TBD].** Post-18, we may want to transition ownership, add him as a member/officer, or convert the arrangement to an employer/employee or contractor relationship. I'd like your advice on how to structure this now to make that transition clean later.

---

## 4. Legal Questions for You

### Entity structure
1. **LLC vs. sole proprietorship.** Given that (a) the business serves minors, (b) it collects medical information, and (c) liability risk exists from physical injury during training, should I form an LLC in my home state? Or is a sole proprietorship sufficient at initial scale?
2. **Where to form.** I assume home-state LLC is correct (not Delaware), but please confirm.
3. **Naming.** "First Step Hoops" — is this clear for use? Do we need a separate DBA if the LLC name differs?

### Minor operating the business
4. What are the legal constraints on my 17-year-old son delivering paid services under my business entity? Is there any labor-law exposure (e.g., does he need to be classified as an employee, a contractor, or a family-business exception)?
5. When he turns 18, what's the cleanest path to transfer ownership or add him as a member/co-owner?

### Liability
6. **Liability insurance.** I plan to purchase youth-sports coaching liability insurance (K&K Insurance, RPS Bollinger, Sadler Sports as candidates). Any specific policy features you'd flag as must-haves given the minor-participants and minor-operator situation?
7. **Waiver of liability / release of claims.** I'd like a waiver drafted that parents sign before the first session. Key features I'd like it to cover:
   - Assumption of risk for physical activity
   - Release of claims for injury
   - Medical-emergency authorization (allowing the coach to call 911 and authorize emergency treatment if a parent is unreachable)
   - Photo/media release (optional — so we can use session photos on marketing materials if the parent agrees)
   - Parent attestation that they're over 18 and the legal guardian of the player
8. **Venue / facility liability.** If we rent gym space (school, rec center, church), they'll likely require us to name them as additionally insured. Any standard language to watch for in their facility agreements?

### Data & compliance
9. We collect from parents: name, email, phone, child's name, grade, experience notes, and **medical notes** (allergies, conditions). Medical info raises flags — what are my obligations around storing this data? Do I need a privacy policy beyond standard? Does this trigger HIPAA? (I believe no, since we're not a covered entity, but want your confirmation.)
10. **Stripe / payment processing.** Stripe will collect and process the payment data — I won't touch card numbers. Any terms-of-service concerns with the business operator being under 18? (Stripe requires account holders to be 18+, which is why I'm the account owner.)
11. **Privacy policy and terms of service** for the website — can you draft these, or should I source a template and have you review?

### Operational
12. **Background check** for the coach (my son). I plan to run one even though he's my kid — it's a trust signal for parents. Any state-specific requirements for working with minors I should know about?
13. **Tax treatment.** I'll be filing this as self-employment income initially. Any structural issues with that given my son is the one performing the service?

---

## 5. How the Booking Flow Works (for context)

A parent visits **firststephoops.com**, views available time slots, and books one. The flow:

1. Picks plan (single session or 4-pack)
2. Selects an available slot
3. Enters parent info (name, email, phone) and player info (child's name, grade, experience, medical notes)
4. **Signs digital liability waiver** (checkbox + typed full legal name; we capture timestamp, IP, and user-agent; the signed waiver version is bound to their record)
5. Pays via Stripe
6. Receives SMS + email confirmation

Returning customers with unused credits from a 4-pack can book future sessions without re-paying, via an email magic link.

Reschedules happen by SMS between parent and coach — the coach then updates the booking in the admin panel.

---

## 6. Data We Store

- Parent: name, email, phone
- Player(s): name, grade, experience notes, medical notes
- Bookings: date, time, location, status (scheduled, delivered, no-show, canceled)
- Payment: handled by Stripe (we store only Stripe's payment intent ID and amount, never card data)
- Waiver records: signed version, timestamp, IP, user-agent, typed name, bound to player

Data is stored in a managed Postgres database (Supabase or Neon) with access restricted to the admin panel (username + password).

---

## 7. What I'm Asking You For

1. **Consultation** on entity structure (LLC vs. sole prop; home state; timing relative to son turning 18)
2. **Draft of the liability waiver** (or review of a template I provide)
3. **Draft of privacy policy and terms of service** (or review)
4. **Review of the insurance policy** once I've selected a carrier
5. **Guidance on labor-law / minor-operating questions** around my son's role
6. **Estimate of your fees** for the above so I can budget

---

## 8. Timeline

- Website and booking system in active development
- Targeting soft launch within ~8–12 weeks
- Would like legal foundation (entity formed, insurance bound, waiver drafted) before accepting first paying customer

---

## 9. Contact

**Owner:** Tristan Pelligrino
**Email:** tpelligrino@motionagency.io
**Business domain:** firststephoops.com
