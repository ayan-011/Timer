"use client";

import { useEffect, useState } from "react";

function parts(startMs:number, nowMs:number) {
  const start = new Date(startMs);
  const now = new Date(nowMs);
  let years = now.getFullYear() - start.getFullYear();
  let anniversary = new Date(start);
  anniversary.setFullYear(start.getFullYear() + years);
  if (anniversary > now) { years--; anniversary = new Date(start); anniversary.setFullYear(start.getFullYear()+years); }

  let months = now.getMonth() - anniversary.getMonth();
  if (months < 0) months += 12;
  let cursor = new Date(anniversary);
  cursor.setMonth(cursor.getMonth()+months);
  if (cursor > now) { months--; cursor = new Date(anniversary); cursor.setMonth(cursor.getMonth()+months); }

  const diff = now.getTime() - cursor.getTime();
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  const milliseconds = diff % 1000;
  return {years,months,days,hours,minutes,seconds,milliseconds};
}

const pad=(n:number,len=2)=>String(n).padStart(len,"0");

export default function AgeTimer({dateOfBirth}:{dateOfBirth:string}) {
  const start = new Date(dateOfBirth).getTime();
  const [now,setNow] = useState(()=>Date.now());

  useEffect(()=>{
    let id:number;
    const tick=()=>{ setNow(Date.now()); id=requestAnimationFrame(tick); };
    id=requestAnimationFrame(tick);
    return ()=>cancelAnimationFrame(id);
  },[]);

  const a=parts(start,now);
  const values=[
    [a.years,"YEARS",false],[a.months,"MONTHS",true],[a.days,"DAYS",true],
    [a.hours,"HOURS",true],[a.minutes,"MINUTES",true],[a.seconds,"SECONDS",true]
  ];

  return (
    <div className="w-full max-w-7xl">
      <div className="flex flex-wrap items-end justify-center gap-x-2 gap-y-4 sm:gap-x-4 md:gap-x-6">
        {values.map(([value,label,shouldPad])=>(
          <div key={String(label)} className="text-center">
            <div className="font-mono text-[clamp(2.7rem,8vw,7.5rem)] font-semibold leading-none tracking-[-.07em] tabular-nums">
              {shouldPad ? pad(Number(value)) : value}
            </div>
            <div className="mt-3 text-[9px] font-medium uppercase tracking-[.28em] text-white/30 sm:text-xs">{label}</div>
          </div>
        ))}
        <div className="text-center">
          <div className="font-mono text-[clamp(2rem,5vw,5rem)] font-medium leading-none tracking-[-.06em] tabular-nums text-white/45">
            {pad(a.milliseconds,3)}
          </div>
          <div className="mt-3 text-[9px] uppercase tracking-[.28em] text-white/20 sm:text-xs">MS</div>
        </div>
      </div>
    </div>
  );
}
