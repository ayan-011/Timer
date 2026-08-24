"use client";

import { useMemo, useState } from "react";

const LIFE_YEARS = 80;

function yearsOverLife(hoursPerDay: number) {
  return (hoursPerDay / 24) * LIFE_YEARS;
}

function formatYears(value: number) {
  return value < 1 ? `${Math.round(value * 12)} months` : `${value.toFixed(1)} years`;
}

export default function TimeUseClient({
  initialScreenTime,
  initialSleepHours
}: {
  initialScreenTime: number;
  initialSleepHours: number;
}) {
  const [screenTime, setScreenTime] = useState(initialScreenTime);
  const [sleepHours, setSleepHours] = useState(initialSleepHours);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const screenYears = useMemo(() => yearsOverLife(screenTime), [screenTime]);
  const sleepYears = useMemo(() => yearsOverLife(sleepHours), [sleepHours]);

  async function save() {
    setError("");
    setSaved(false);
    const res = await fetch("/api/time-use", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ screenTimeHours: screenTime, sleepHours })
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Could not save.");
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[.4em] text-white/35">02 / Time use</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">
          Where does your life go?
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-6 text-white/40">
          Tell us how much time you sleep and spend on screens each day. We&apos;ll show the amount that adds up across an 80-year life.
        </p>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        <section className="glass rounded-3xl p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[.25em] text-white/35">Daily screen time</p>
          <div className="mt-7 flex items-end gap-3">
            <input
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={screenTime}
              onChange={(e) => setScreenTime(Math.min(24, Math.max(0, Number(e.target.value))))}
              className="w-32 border-b border-white/20 bg-transparent text-6xl font-semibold tracking-tight outline-none"
            />
            <span className="pb-2 text-sm text-white/35">hours / day</span>
          </div>
          <p className="mt-8 text-sm text-white/40">Across 80 years, that becomes</p>
          <p className="mt-2 text-4xl font-medium">{formatYears(screenYears)}</p>
          <p className="mt-2 text-xs text-white/25">of your life spent looking at a screen.</p>
        </section>

        <section className="glass rounded-3xl p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[.25em] text-white/35">Daily sleep</p>
          <div className="mt-7 flex items-end gap-3">
            <input
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={sleepHours}
              onChange={(e) => setSleepHours(Math.min(24, Math.max(0, Number(e.target.value))))}
              className="w-32 border-b border-white/20 bg-transparent text-6xl font-semibold tracking-tight outline-none"
            />
            <span className="pb-2 text-sm text-white/35">hours / day</span>
          </div>
          <p className="mt-8 text-sm text-white/40">Across 80 years, that becomes</p>
          <p className="mt-2 text-4xl font-medium">{formatYears(sleepYears)}</p>
          <p className="mt-2 text-xs text-white/25">of your life spent sleeping.</p>
        </section>
      </div>

      <div className="mt-4 rounded-3xl border border-white/10 bg-white/[.03] p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[.25em] text-white/30">A different way to see it</p>
        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          <div>
            <p className="text-3xl font-medium">{screenYears.toFixed(1)}</p>
            <p className="mt-1 text-xs text-white/35">years on screens</p>
          </div>
          <div>
            <p className="text-3xl font-medium">{sleepYears.toFixed(1)}</p>
            <p className="mt-1 text-xs text-white/35">years asleep</p>
          </div>
          <div>
            <p className="text-3xl font-medium">{Math.max(0, LIFE_YEARS - screenYears - sleepYears).toFixed(1)}</p>
            <p className="mt-1 text-xs text-white/35">years left for everything else</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button onClick={save} className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-white/85">
          Save my numbers
        </button>
        {saved && <span className="text-sm text-green-400">Saved.</span>}
        {error && <span className="text-sm text-red-400">{error}</span>}
      </div>
    </div>
  );
}
