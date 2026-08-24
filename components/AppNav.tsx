"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export type NavUser = {
  id: string;
  username: string;
  dateOfBirth: string;
  profileImage: string | null;
};

export default function AppNav({ user }: { user: NavUser }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const links = [
    ["#timer", "Timer"],
    ["#time-use", "Time Use"],
    ["#life-progress", "Life Progress"],
    ["#goals", "Goals"],
    ["#thoughts", "Thoughts"],
  ];

  function scrollToSection(href: string) {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/55 backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between px-4 sm:px-6 md:px-10">
        <div className="shrink-0">
          <div className="text-sm font-semibold tracking-[.25em]">TIME</div>
          <div className="mt-1 text-[8px] uppercase tracking-[.28em] text-white/30">is running</div>
        </div>

        <div className="mx-4 hidden min-w-0 flex-1 items-center justify-center gap-1 md:flex">
          {links.map(([href, label]) => (
            <button
              key={href}
              onClick={() => scrollToSection(href)}
              className="rounded-full px-3 py-2 text-[10px] uppercase tracking-[.18em] text-white/45 transition hover:bg-white/5 hover:text-white"
            >
              {label}
            </button>
          ))}
        </div>

        <div ref={profileRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex cursor-pointer items-center gap-3 rounded-full border border-white/10 bg-white/5 p-1.5 pr-3"
          >
            <div className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-white text-sm font-bold text-black">
              {user.profileImage ? (
                <img src={user.profileImage} alt="" className="h-full w-full object-cover" />
              ) : (
                user.username[0]?.toUpperCase()
              )}
            </div>
            <span className="hidden max-w-24 truncate text-sm text-white/75 sm:block">{user.username}</span>
          </button>

          {open && (
            <div className="absolute right-0 top-[calc(100%+10px)] z-[100] w-60 rounded-2xl border border-white/10 bg-[#111] p-2 shadow-2xl">
              <div className="px-3 py-3">
                <p className="text-sm font-medium text-white">{user.username}</p>
                <p className="mt-1 break-all text-[10px] text-white/30">ID: {user.id}</p>
              </div>
              <div className="my-1 h-px bg-white/10" />
              <button
                type="button"
                onClick={() => { setOpen(false); router.push("/dashboard/edit-profile"); }}
                className="w-full rounded-xl px-3 py-2 text-left text-sm text-white/75 hover:bg-white/5"
              >
                Edit Profile
              </button>
              <button
                type="button"
                onClick={logout}
                className="mt-1 w-full rounded-xl px-3 py-2 text-left text-sm text-red-400 hover:bg-white/5"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto border-t border-white/5 px-3 py-2 md:hidden">
        {links.map(([href, label]) => (
          <button
            key={href}
            onClick={() => scrollToSection(href)}
            className="shrink-0 rounded-full px-3 py-1.5 text-[9px] uppercase tracking-[.16em] text-white/45 hover:bg-white/5 hover:text-white"
          >
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}
