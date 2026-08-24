"use client";

import { useState } from "react";

export type Goal = {
  id: string;
  period: "day" | "week" | "month" | "year";
  goal: string;
  achieved: string;
  createdAt: string;
};

export default function GoalsClient({ initialGoals }: { initialGoals: Goal[] }) {
  const [period, setPeriod] = useState<Goal["period"]>("month");
  const [goal, setGoal] = useState("");
  const [achieved, setAchieved] = useState("");
  const [goals, setGoals] = useState(initialGoals);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function saveGoal() {
    if (!goal.trim()) {
      setError("Write something you want to achieve first.");
      return;
    }
    setSaving(true);
    setError("");

    const newGoal: Goal = {
      id: crypto.randomUUID(),
      period,
      goal: goal.trim(),
      achieved: achieved.trim(),
      createdAt: new Date().toISOString()
    };

    const next = [newGoal, ...goals];

    const res = await fetch("/api/goals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goals: next })
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Could not save your goal.");
      return;
    }

    setGoals(next);
    setGoal("");
    setAchieved("");
  }

  async function removeGoal(id: string) {
    const next = goals.filter((item) => item.id !== id);
    const res = await fetch("/api/goals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goals: next })
    });
    if (res.ok) setGoals(next);
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="max-w-3xl">
        <p className="text-xs uppercase tracking-[.4em] text-white/35">04 / Goals</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">
          What will you do with the time ahead?
        </h1>
        <p className="mt-4 text-sm leading-6 text-white/40">
          Choose a time horizon, write what you want to accomplish, and come back to record what you actually achieved.
        </p>
      </div>

      <section className="glass mt-10 rounded-3xl p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[.25em] text-white/35">I want to achieve in the next</p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as Goal["period"])}
            className="cursor-pointer rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm outline-none"
          >
            <option value="day">day</option>
            <option value="week">week</option>
            <option value="month">month</option>
            <option value="year">year</option>
          </select>
          <span className="text-sm text-white/35">I want to make it count.</span>
        </div>

        <textarea
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          rows={4}
          placeholder="What do you want to achieve?"
          className="mt-6 w-full resize-none rounded-2xl border border-white/10 bg-white/[.03] px-5 py-4 text-sm outline-none placeholder:text-white/20 focus:border-white/25"
        />

        <textarea
          value={achieved}
          onChange={(e) => setAchieved(e.target.value)}
          rows={3}
          placeholder="What did you achieve? (optional for now)"
          className="mt-3 w-full resize-none rounded-2xl border border-white/10 bg-white/[.03] px-5 py-4 text-sm outline-none placeholder:text-white/20 focus:border-white/25"
        />

        <div className="mt-5 flex items-center gap-4">
          <button
            disabled={saving}
            onClick={saveGoal}
            className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save goal"}
          </button>
          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>
      </section>

      {goals.length > 0 && (
        <section className="mt-4">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[.25em] text-white/30">Your goals</p>
              <p className="mt-2 text-sm text-white/35">{goals.length} saved</p>
            </div>
          </div>

          <div className="space-y-3">
            {goals.map((item) => (
              <article key={item.id} className="rounded-2xl border border-white/10 bg-white/[.025] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-[9px] uppercase tracking-[.18em] text-white/35">
                      next {item.period}
                    </span>
                    <h2 className="mt-4 text-lg text-white/85">{item.goal}</h2>
                    {item.achieved && (
                      <div className="mt-4 border-l border-white/15 pl-4">
                        <p className="text-[9px] uppercase tracking-[.18em] text-white/25">Achieved</p>
                        <p className="mt-1 text-sm leading-6 text-white/50">{item.achieved}</p>
                      </div>
                    )}
                  </div>
                  <button onClick={() => removeGoal(item.id)} className="text-xs text-white/25 hover:text-red-400">
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
