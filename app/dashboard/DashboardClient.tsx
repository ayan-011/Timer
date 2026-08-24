"use client";

import AgeTimer from "@/components/AgeTimer";
import AppNav, { NavUser } from "@/components/AppNav";
import TimeUseClient from "./time-use/TimeUseClient";
import LifeProgressClient from "./life-progress/LifeProgressClient";
import GoalsClient, { Goal } from "./goals/GoalsClient";
import ThoughtsClient from "./thoughts/ThoughtsClient";

export type DashboardData = NavUser & {
  screenTimeMinutes: number;
  sleepHours: number;
  goals: Goal[];
};

export default function DashboardClient({ user }: { user: DashboardData }) {
  return (
    <main className="min-h-screen bg-[#050505] grid-bg">
      <AppNav user={user} />

      <section id="timer" className="scroll-mt-24 flex min-h-screen flex-col items-center justify-center px-4 pb-16 pt-32 md:pt-24">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[.4em] text-white/35">Your life, right now</p>
          <h1 className="mt-3 text-2xl font-medium text-white/80 sm:text-3xl">
            You are getting older while you read this.
          </h1>
        </div>

        <AgeTimer dateOfBirth={user.dateOfBirth} />

        <p className="mt-10 max-w-xl text-center text-sm leading-6 text-white/35">
          Every millisecond you see is already gone. Your clock is calculated from your date of birth and the current time, so it never resets.
        </p>
      </section>

      <section id="time-use" className="scroll-mt-24 min-h-screen px-4 py-24 sm:py-32">
        <TimeUseClient
          initialScreenTime={user.screenTimeMinutes / 60}
          initialSleepHours={user.sleepHours}
        />
      </section>

      <section id="life-progress" className="scroll-mt-24 min-h-screen px-4 py-24 sm:py-32">
        <LifeProgressClient dateOfBirth={user.dateOfBirth} />
      </section>

      <section id="goals" className="scroll-mt-24 min-h-screen px-4 py-24 sm:py-32">
        <GoalsClient initialGoals={user.goals} />
      </section>

      <section id="thoughts" className="scroll-mt-24 min-h-screen px-4 py-24 sm:py-32">
        <ThoughtsClient />
      </section>
    </main>
  );
}
