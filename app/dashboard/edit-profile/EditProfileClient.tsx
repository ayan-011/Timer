"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditProfileClient({user}:{user:{username:string;dateOfBirth:string;profileImage:string|null}}) {
  const router=useRouter();
  const [form,setForm]=useState({username:user.username,dateOfBirth:user.dateOfBirth,profileImage:user.profileImage||""});
  const [error,setError]=useState("");
  const [saved,setSaved]=useState(false);

  function imageToDataUrl(file:File) {
    if(file.size>2*1024*1024) { setError("Profile image must be under 2MB."); return; }
    const reader=new FileReader();
    reader.onload=()=>setForm(f=>({...f,profileImage:String(reader.result)}));
    reader.readAsDataURL(file);
  }

  async function submit(e:FormEvent) {
    e.preventDefault(); setError(""); setSaved(false);
    const res=await fetch("/api/profile",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
    const data=await res.json();
    if(!res.ok) return setError(data.error||"Could not save.");
    setSaved(true); setTimeout(()=>router.push("/dashboard"),600);
  }

  return (
    <main className="min-h-screen grid-bg flex items-center justify-center p-6">
      <form onSubmit={submit} className="glass w-full max-w-lg rounded-3xl p-8">
        <a href="/dashboard" className="text-sm text-white/40 hover:text-white">← Back to dashboard</a>
        <h1 className="mt-5 text-4xl font-semibold">Edit profile</h1>
        <div className="mt-8 space-y-5">
          <div className="flex items-center gap-4">
            <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-full bg-white text-2xl font-bold text-black">
              {form.profileImage ? <img src={form.profileImage} alt="" className="h-full w-full object-cover"/> : form.username[0]?.toUpperCase()}
            </div>
            <label className="cursor-pointer rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10">
              Change picture
              <input type="file" accept="image/*" className="hidden" onChange={e=>e.target.files?.[0]&&imageToDataUrl(e.target.files[0])}/>
            </label>
          </div>
          <input value={form.username} onChange={e=>setForm({...form,username:e.target.value})} required
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none" placeholder="Username"/>
          <label className="block text-sm text-white/50">Date of birth
            <input type="date" value={form.dateOfBirth} onChange={e=>setForm({...form,dateOfBirth:e.target.value})} required
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none"/>
          </label>
          {error&&<p className="text-sm text-red-400">{error}</p>}
          {saved&&<p className="text-sm text-green-400">Saved. Updating your clock...</p>}
          <button className="w-full rounded-xl bg-white px-4 py-3 font-medium text-black">Save changes</button>
        </div>
      </form>
    </main>
  );
}
