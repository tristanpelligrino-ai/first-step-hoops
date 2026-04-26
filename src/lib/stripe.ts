import Stripe from "stripe";

let _client: Stripe | null = null;

export function getStripe(): Stripe {
  if (_client) return _client;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  _client = new Stripe(key);
  return _client;
}

export const PRICES = {
  /** Single session in cents */
  single: 2500,
  /** 4-pack in cents (Phase 6) */
  pack: 7500,
} as const;
