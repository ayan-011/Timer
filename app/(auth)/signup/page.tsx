"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({username:"", password:"", dateOfBirth:""});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault(); setLoading(true); setError("");
    const res = await fetch("/api/auth/signup", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify(form)
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error || "Signup failed");
    router.push("/dashboard"); router.refresh();
  }

  return (
    <main className="min-h-screen grid-bg flex items-center justify-center p-6">
      <form onSubmit={submit} className="glass w-full max-w-md rounded-3xl p-8">
        <p className="text-xs uppercase tracking-[.35em] text-white/45">Begin here</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">Start the clock.</h1>
        <p className="mt-2 text-white/50">Your date of birth becomes the starting point.</p>
        <div className="mt-8 space-y-4">
          <input required minLength={3} value={form.username} onChange={e=>setForm({...form,username:e.target.value})} placeholder="Username"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none"/>
          <input required minLength={6} value={form.password} onChange={e=>setForm({...form,password:e.target.value})} type="password" placeholder="Password (6+ characters)"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none"/>
          <label className="block text-sm text-white/50">Date of birth
            <input required value={form.dateOfBirth} onChange={e=>setForm({...form,dateOfBirth:e.target.value})} type="date"
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"/>
          </label>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button disabled={loading} className="w-full rounded-xl bg-white px-4 py-3 font-medium text-black disabled:opacity-50">
            {loading ? "Creating..." : "Create my clock"}
          </button>
        </div>
        <p className="mt-6 text-center text-sm text-white/45">Already have an account? <Link className="text-white underline" href="/login">Log in</Link></p>
      </form>
    </main>
  );
}
