"use client";

import { useState } from "react";

/**
 * Read-only booking link for a group / private slot with a copy button.
 * The slot id in the URL is the access token — anyone with the link can book
 * a seat, up to the slot's capacity.
 */
export function ShareLinkBox({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable (e.g. non-HTTPS) — the field is selectable
      // so the user can copy manually.
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        readOnly
        value={url}
        onFocus={(e) => e.currentTarget.select()}
        className="h-10 px-2 bg-navy-2 border border-white/15 rounded-btn text-white/80 text-[12px] font-mono focus:border-blue focus:outline-none"
      />
      <button
        type="button"
        onClick={copy}
        className="h-10 px-4 inline-flex items-center justify-center bg-blue hover:bg-blue-soft text-white rounded-btn text-[12px] font-semibold uppercase tracking-[0.06em] transition-colors"
      >
        {copied ? "Copied ✓" : "Copy booking link"}
      </button>
    </div>
  );
}
