"use client";

import { useEffect, useMemo, useOptimistic, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSlotAtAction, quickDeleteSlotAction } from "@/lib/actions/slots";

type Slot = {
  id: string;
  startsAt: string; // ISO UTC (serialized from the server component)
  durationMin: number;
  location: string;
  status: "open" | "booked" | "canceled";
  isPrivate: boolean;
  capacity: number;
};

type Props = {
  weekStartIso: string; // ISO UTC for the Sunday midnight (local) that starts the visible week
  slots: Slot[];
  businessTz: string; // passed for display; actual TZ math uses browser for now
};

const FIRST_HOUR = 8;   // grid starts at 8:00 local
const LAST_HOUR = 20;   // grid ends at 20:00 local (last cell = 20:00-20:59)

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function ScheduleGrid({ weekStartIso, slots, businessTz }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [defaults, setDefaults] = useState<{
    location: string;
    duration: number;
    isPrivate: boolean;
  }>({ location: "", duration: 50, isPrivate: false });
  const { location, duration, isPrivate } = defaults;
  const [notice, setNotice] = useState<string | null>(null);

  // Load saved defaults from localStorage once after mount. We need the effect
  // because localStorage isn't available during SSR; reading it in useState's
  // initializer would cause a hydration mismatch on first paint.
  useEffect(() => {
    const saved = window.localStorage.getItem("fsh.scheduleDefaults");
    if (!saved) return;
    try {
      const v = JSON.parse(saved);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- legitimate sync from localStorage on mount
      setDefaults((prev) => ({
        location: typeof v.location === "string" ? v.location : prev.location,
        duration: typeof v.duration === "number" ? v.duration : prev.duration,
        isPrivate: typeof v.isPrivate === "boolean" ? v.isPrivate : prev.isPrivate,
      }));
    } catch {}
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      "fsh.scheduleDefaults",
      JSON.stringify(defaults),
    );
  }, [defaults]);

  const weekStart = useMemo(() => new Date(weekStartIso), [weekStartIso]);
  const days = useMemo(() => {
    const out: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      out.push(d);
    }
    return out;
  }, [weekStart]);

  const hours = useMemo(() => {
    const out: number[] = [];
    for (let h = FIRST_HOUR; h <= LAST_HOUR; h++) out.push(h);
    return out;
  }, []);

  // Index slots by "YYYY-MM-DD HH" in local time
  type OptimisticSlot = Slot | { id: string; pending: true; startsAt: string; location: string };
  const [optimistic, addOptimistic] = useOptimistic<OptimisticSlot[], OptimisticSlot>(
    slots,
    (state, incoming) => [...state, incoming],
  );

  const byCellKey = useMemo(() => {
    const map = new Map<string, OptimisticSlot>();
    for (const s of optimistic) {
      map.set(cellKeyFor(new Date(s.startsAt)), s);
    }
    return map;
  }, [optimistic]);

  function handleCellClick(date: Date, hour: number) {
    if (!location.trim()) {
      setNotice("Set a location at the top before clicking cells.");
      return;
    }
    const slotDate = new Date(date);
    slotDate.setHours(hour, 0, 0, 0);
    const utcIso = slotDate.toISOString();
    const key = cellKeyFor(slotDate);

    if (byCellKey.has(key)) {
      // Already has a slot — navigate to edit page
      const existing = byCellKey.get(key)!;
      if ("pending" in existing) return;
      router.push(`/admin/slots/${existing.id}`);
      return;
    }

    setNotice(null);
    startTransition(async () => {
      addOptimistic({
        id: `tmp-${utcIso}`,
        pending: true,
        startsAt: utcIso,
        location: location.trim(),
      });
      const result = await createSlotAtAction({
        startsAtUtc: utcIso,
        durationMin: duration,
        location: location.trim(),
        isPrivate,
        capacity: 1,
      });
      if (!result.ok) {
        setNotice(result.error);
      }
      router.refresh();
    });
  }

  function handleQuickDelete(e: React.MouseEvent, slotId: string) {
    e.stopPropagation();
    e.preventDefault();
    if (!window.confirm("Delete this open slot?")) return;
    startTransition(async () => {
      const result = await quickDeleteSlotAction(slotId);
      if (!result.ok) setNotice(result.error);
      router.refresh();
    });
  }

  const prevWeek = shiftWeek(weekStart, -7);
  const nextWeek = shiftWeek(weekStart, 7);
  const thisWeek = startOfWeek(new Date());

  return (
    <div>
      {/* Defaults / controls */}
      <div className="grid grid-cols-[1.5fr_auto_auto] gap-4 mb-6 p-5 border border-white/10 bg-navy-2/40 max-[860px]:grid-cols-1">
        <label className="flex flex-col gap-2">
          <span className="mono-eyebrow text-white/60">
            Location for new slots<span className="text-orange"> *</span>
          </span>
          <input
            type="text"
            value={location}
            onChange={(e) => setDefaults((d) => ({ ...d, location: e.target.value }))}
            placeholder="e.g. Deep Run HS outdoor courts"
            className="h-11 px-3 bg-navy border border-white/15 rounded-btn text-white text-[15px] focus:border-blue focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="mono-eyebrow text-white/60">Duration (min)</span>
          <input
            type="number"
            min={1}
            max={480}
            value={duration}
            onChange={(e) => setDefaults((d) => ({ ...d, duration: Number(e.target.value) || 50 }))}
            className="h-11 w-[100px] px-3 bg-navy border border-white/15 rounded-btn text-white text-[15px] focus:border-blue focus:outline-none [color-scheme:dark]"
          />
        </label>
        <label className="flex items-end gap-2 pb-[2px]">
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setDefaults((d) => ({ ...d, isPrivate: e.target.checked }))}
            className="w-4 h-4 accent-blue"
          />
          <span className="text-[14px] text-white">Private</span>
        </label>
      </div>

      {/* Week nav */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/calendar?week=${toDateParam(prevWeek)}`}
            className="h-9 px-4 inline-flex items-center border border-white/20 hover:border-white/60 text-white text-[13px] rounded-btn transition-colors"
          >
            ← Prev
          </Link>
          <Link
            href={`/admin/calendar?week=${toDateParam(thisWeek)}`}
            className="h-9 px-4 inline-flex items-center border border-white/20 hover:border-white/60 text-white text-[13px] rounded-btn transition-colors"
          >
            This week
          </Link>
          <Link
            href={`/admin/calendar?week=${toDateParam(nextWeek)}`}
            className="h-9 px-4 inline-flex items-center border border-white/20 hover:border-white/60 text-white text-[13px] rounded-btn transition-colors"
          >
            Next →
          </Link>
        </div>
        <div className="text-[12px] font-mono uppercase tracking-[0.08em] text-white/50">
          Week of {formatRangeLabel(days[0], days[6])} · {businessTz.replace("_", " ")}
        </div>
      </div>

      {notice ? (
        <p className="mb-4 text-orange text-[13px] font-mono">{notice}</p>
      ) : null}

      {/* Grid */}
      <div className="border border-white/10 bg-navy-2/40 overflow-hidden">
        {/* Day header row */}
        <div
          className="grid text-[11px] font-mono uppercase tracking-[0.08em] text-white/60"
          style={{ gridTemplateColumns: "70px repeat(7, 1fr)" }}
        >
          <div />
          {days.map((d, i) => (
            <div key={i} className="px-3 py-3 border-l border-white/5 text-center">
              <div className="text-white/50">{DAY_LABELS[d.getDay()]}</div>
              <div className="text-white text-[14px] font-sans normal-case tracking-normal mt-1">
                {d.getMonth() + 1}/{d.getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* Hour rows */}
        {hours.map((h) => (
          <div
            key={h}
            className="grid border-t border-white/10"
            style={{ gridTemplateColumns: "70px repeat(7, 1fr)" }}
          >
            <div className="px-3 py-2 text-[11px] font-mono uppercase tracking-[0.08em] text-white/50 flex items-start justify-end">
              {formatHourLabel(h)}
            </div>
            {days.map((d, di) => {
              const cellDate = new Date(d);
              cellDate.setHours(h, 0, 0, 0);
              const key = cellKeyFor(cellDate);
              const slot = byCellKey.get(key);
              return (
                <Cell
                  key={`${di}-${h}`}
                  slot={slot}
                  isPending={isPending}
                  onClick={() => handleCellClick(d, h)}
                  onQuickDelete={handleQuickDelete}
                />
              );
            })}
          </div>
        ))}
      </div>

      <p className="mt-4 text-[12px] text-white/50 font-mono">
        Click an empty cell to create an open slot. Click a filled cell to edit it.
      </p>
    </div>
  );
}

function Cell({
  slot,
  isPending,
  onClick,
  onQuickDelete,
}: {
  slot?: { id: string; status?: string; isPrivate?: boolean; pending?: boolean; location?: string };
  isPending: boolean;
  onClick: () => void;
  onQuickDelete: (e: React.MouseEvent, id: string) => void;
}) {
  const base =
    "relative border-l border-white/5 h-[54px] flex flex-col justify-center px-2 text-[11px] cursor-pointer transition-colors";
  if (!slot) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={isPending}
        className={`${base} bg-transparent hover:bg-white/[0.04] text-white/30 hover:text-white/60`}
        title="Click to add a slot at this time"
      >
        <span className="select-none">+</span>
      </button>
    );
  }
  const isPendingSlot = "pending" in slot && slot.pending;
  const status = (slot as Slot).status ?? "open";
  const stateClasses = isPendingSlot
    ? "bg-blue/30 animate-pulse text-white"
    : status === "open"
      ? "bg-blue/30 hover:bg-blue/50 text-white"
      : status === "booked"
        ? "bg-orange/30 hover:bg-orange/50 text-white"
        : "bg-white/5 text-white/40";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isPending || isPendingSlot}
      className={`${base} ${stateClasses}`}
      title={`${status}${slot.isPrivate ? " · private" : ""} — click to edit`}
    >
      <span className="font-semibold text-[12px] truncate">
        {status === "open" ? "Open" : status === "booked" ? "Booked" : "Canceled"}
        {slot.isPrivate ? " · P" : ""}
      </span>
      {slot.location ? (
        <span className="text-white/60 truncate">{slot.location}</span>
      ) : null}
      {!isPendingSlot && status === "open" ? (
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => onQuickDelete(e, slot.id!)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onQuickDelete(e as unknown as React.MouseEvent, slot.id!);
            }
          }}
          className="absolute top-1 right-1 text-white/40 hover:text-orange text-[12px] px-1 cursor-pointer leading-none"
          aria-label="Delete this slot"
          title="Delete"
        >
          ×
        </span>
      ) : null}
    </button>
  );
}

// -------------------- helpers --------------------

function startOfWeek(d: Date): Date {
  const out = new Date(d);
  out.setHours(0, 0, 0, 0);
  out.setDate(out.getDate() - out.getDay()); // Sunday = 0
  return out;
}

function shiftWeek(d: Date, days: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + days);
  return out;
}

function toDateParam(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function formatRangeLabel(a: Date, b: Date): string {
  const monthDay = (x: Date) =>
    `${x.toLocaleString("en-US", { month: "short" })} ${x.getDate()}`;
  return `${monthDay(a)} – ${monthDay(b)}`;
}

function formatHourLabel(hour: number): string {
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  const ampm = hour < 12 ? "am" : "pm";
  return `${h12}${ampm}`;
}

function cellKeyFor(date: Date): string {
  // Local time cell key
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    ` ${pad(date.getHours())}`
  );
}
