"use client";

import { useEffect, useState } from "react";

const thoughts = [
  "The trouble is, you think you have time.",
  "Time is what we want most, but what we use worst.",
  "The future depends on what you do today.",
  "Lost time is never found again.",
  "One day, you will wish you had started today.",
  "Your life is happening while you are waiting for it to begin.",
  "The clock does not stop. Neither should the things that matter.",
  "You do not need more time. You need to decide what matters.",
  "The days are long, but the years are short.",
  "What you do with today becomes what you remember tomorrow."
];

function randomThought(previous: string) {
  const options = thoughts.filter((item) => item !== previous);
  return options[Math.floor(Math.random() * options.length)];
}

export default function ThoughtsClient() {
  const [thought, setThought] = useState(thoughts[0]);

  useEffect(() => {
    const id = setInterval(() => setThought((current) => randomThought(current)), 7000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="flex min-h-[calc(100vh-9rem)] flex-col items-center justify-center text-center">
      <p className="text-[10px] uppercase tracking-[.45em] text-white/20">05 / A thought about time</p>

      <blockquote className="mt-8 max-w-4xl text-4xl font-medium leading-[1.08] tracking-tight text-white/85 sm:text-6xl lg:text-7xl">
        “{thought}”
      </blockquote>

      <p className="mt-8 max-w-md text-sm leading-6 text-white/30">
        Stay here for a moment. The thought changes automatically because, like everything else, this moment will pass.
      </p>

      <button
        onClick={() => setThought((current) => randomThought(current))}
        className="mt-8 rounded-full border border-white/10 px-6 py-3 text-xs uppercase tracking-[.22em] text-white/45 transition hover:bg-white/5 hover:text-white"
      >
        Another thought
      </button>
    </section>
  );
}
