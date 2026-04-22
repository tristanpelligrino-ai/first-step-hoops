"use client";

import { useState } from "react";
import { TextField } from "./form/TextField";
import { CheckboxField } from "./form/CheckboxField";
import { SubmitButton } from "./form/SubmitButton";

type Mode = "create" | "edit";

export function SlotForm({
  mode,
  action,
  defaults,
}: {
  mode: Mode;
  action: (formData: FormData) => void | Promise<void>;
  defaults?: {
    startsAtUtc?: string; // ISO UTC from DB
    durationMin?: number;
    location?: string;
    isPrivate?: boolean;
    capacity?: number;
  };
}) {
  const initialLocal = defaults?.startsAtUtc
    ? utcToLocalInputValue(defaults.startsAtUtc)
    : "";

  const [localDt, setLocalDt] = useState(initialLocal);
  const utcIso = localToUtcIso(localDt);

  return (
    <form action={action} className="flex flex-col gap-5 max-w-[560px]">
      {/* Visible field — the user types in their local time. Not submitted. */}
      <label className="flex flex-col gap-2">
        <span className="mono-eyebrow text-white/60">
          Date & time<span className="text-orange"> *</span>
        </span>
        <input
          type="datetime-local"
          required
          value={localDt}
          onChange={(e) => setLocalDt(e.target.value)}
          className="h-11 px-3 bg-navy-2 border border-white/15 rounded-btn text-white text-[15px] focus:border-blue focus:outline-none [color-scheme:dark]"
        />
        <span className="text-[12px] text-white/50">
          Shown in your local time. Converted to UTC on save.
        </span>
      </label>

      {/* Hidden field — the UTC ISO string that the server action reads. */}
      <input type="hidden" name="startsAt" value={utcIso} />

      <TextField
        name="durationMin"
        label="Duration (minutes)"
        type="number"
        required
        min={1}
        max={480}
        defaultValue={defaults?.durationMin ?? 50}
      />

      <TextField
        name="location"
        label="Location"
        required
        defaultValue={defaults?.location ?? ""}
        placeholder="e.g. St. Mark's Gym, Arlington"
      />

      <TextField
        name="capacity"
        label="Capacity"
        type="number"
        min={1}
        max={20}
        defaultValue={defaults?.capacity ?? 1}
        hint="Leave at 1 for standard 1-on-1 slots. Higher for private sibling bookings."
      />

      <CheckboxField
        name="isPrivate"
        label="Private slot"
        defaultChecked={defaults?.isPrivate}
        hint="Private slots are hidden from public booking — used for invite-only / sibling bookings."
      />

      <div className="flex gap-3 mt-2">
        <SubmitButton>{mode === "create" ? "Create Slot" : "Save Changes"}</SubmitButton>
      </div>
    </form>
  );
}

function utcToLocalInputValue(isoUtc: string): string {
  const d = new Date(isoUtc);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `T${pad(d.getHours())}:${pad(d.getMinutes())}`
  );
}

function localToUtcIso(localValue: string): string {
  if (!localValue) return "";
  const d = new Date(localValue);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString();
}
