"use client";

import { useEffect, useMemo, useState } from "react";

const LIFE_YEARS = 80;
const TOTAL_MONTHS = 960;

function ageParts(dob: Date, now: Date) {
  let years = now.getFullYear() - dob.getFullYear();
  let months = now.getMonth() - dob.getMonth();
  let days = now.getDate() - dob.getDate();

  if (days < 0) {
    months--;
    const previousMonthDays = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += previousMonthDays;
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  return { years: Math.max(0, years), months: Math.max(0, months), days: Math.max(0, days) };
}

export default function LifeProgressClient({ dateOfBirth }: { dateOfBirth: string }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const dob = useMemo(() => new Date(dateOfBirth), [dateOfBirth]);
  const age = useMemo(() => ageParts(dob, now), [dob, now]);

  const progress = useMemo(() => {
    const end = new Date(dob);
    end.setFullYear(end.getFullYear() + LIFE_YEARS);
    const lived = now.getTime() - dob.getTime();
    const total = end.getTime() - dob.getTime();
    return Math.min(100, Math.max(0, (lived / total) * 100));
  }, [dob, now]);

  const livedMonths = Math.min(
    TOTAL_MONTHS,
    Math.max(0, age.years * 12 + age.months + (now.getDate() >= dob.getDate() ? 1 : 0))
  );

  return (
    <div className="mx-auto max-w-6xl">
      <div className="max-w-3xl">
        <p className="text-xs uppercase tracking-[.4em] text-white/35">03 / Life progress</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">
          See how much of your life has passed.
        </h1>
        <p className="mt-4 text-sm leading-6 text-white/40">
          One box represents one month of an 80-year life. The white boxes are the months you have already reached.
        </p>
      </div>

      <section className="glass mt-10 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-sm text-white/40">Your age</p>
            <p className="mt-2 text-4xl font-medium tabular-nums sm:text-6xl">
              {age.years} <span className="text-lg text-white/35">years</span>{" "}
              {age.months} <span className="text-lg text-white/35">months</span>
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-sm text-white/40">Assuming an 80-year lifespan</p>
            <p className="mt-2 text-4xl font-medium tabular-nums">{progress.toFixed(1)}%</p>
          </div>
        </div>

        <div className="mt-8 h-3 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-white transition-[width] duration-700" style={{ width: `${progress}%` }} />
        </div>

        <div className="mt-3 flex justify-between text-xs text-white/30">
          <span>{progress.toFixed(1)}% lived</span>
          <span>{(100 - progress).toFixed(1)}% remaining</span>
        </div>
      </section>

      <section className="mt-4 rounded-3xl border border-white/10 bg-white/[.025] p-5 sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[.25em] text-white/35">Your life in months</p>
            <p className="mt-2 text-sm text-white/35">{livedMonths.toLocaleString()} of {TOTAL_MONTHS.toLocaleString()} months reached</p>
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/30">
            <span className="h-3 w-3 rounded-[2px] bg-white" /> lived
            <span className="ml-2 h-3 w-3 rounded-[2px] border border-white/10 bg-white/[.04]" /> ahead
          </div>
        </div>

        <div
          className="mt-7 grid gap-[3px] overflow-x-auto pb-2"
          style={{ gridTemplateColumns: "repeat(24, minmax(10px, 1fr))" }}
        >
          {Array.from({ length: TOTAL_MONTHS }, (_, index) => {
            const lived = index < livedMonths;
            const year = Math.floor(index / 12);
            const month = (index % 12) + 1;
            return (
              <div
                key={index}
                title={`Year ${year + 1}, month ${month}${lived ? " — lived" : " — future"}`}
                className={`aspect-square min-w-[10px] rounded-[2px] transition ${
                  lived ? "bg-white" : "border border-white/10 bg-white/[.035]"
                }`}
              />
            );
          })}
        </div>

        <div className="mt-5 flex justify-between text-[10px] uppercase tracking-[.18em] text-white/20">
          <span>Born</span>
          <span>40 years</span>
          <span>80 years</span>
        </div>
      </section>
    </div>
  );
}
