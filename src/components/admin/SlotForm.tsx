"use client";

import { useRef } from "react";
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
  // For edit mode, convert the stored UTC time to a datetime-local string
  // using the browser's local timezone. The user sees/edits their local time.
  const defaultDateTimeLocal = defaults?.startsAtUtc
    ? utcToLocalInputValue(defaults.startsAtUtc)
    : "";

  const formRef = useRef<HTMLFormElement>(null);

  // On submit, convert the datetime-local value (browser local time) into
  // a UTC ISO string before the form is submitted. The server action then
  // parses a proper absolute moment via new Date(isoString).
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    const dt = form.elements.namedItem("startsAt") as HTMLInputElement | null;
    if (!dt || !dt.value) return; // let native required validation run
    const asUtcIso = new Date(dt.value).toISOString();
    dt.value = asUtcIso;
  }

  return (
    <form
      ref={formRef}
      action={action}
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 max-w-[560px]"
    >
      <TextField
        name="startsAt"
        label="Date & time"
        type="datetime-local"
        required
        defaultValue={defaultDateTimeLocal}
        hint="Shown in your local time. Converted to UTC on save."
      />

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
