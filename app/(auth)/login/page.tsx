"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST", headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error || "Login failed");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen grid-bg flex items-center justify-center p-6">
      <form onSubmit={submit} className="glass w-full max-w-md rounded-3xl p-8 shadow-2xl">
        <p className="text-xs uppercase tracking-[.35em] text-white/45">Time Is Running</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">Welcome back.</h1>
        <p className="mt-2 text-white/50">Your timer never stopped.</p>
        <div className="mt-8 space-y-4">
          <input value={username} onChange={e=>setUsername(e.target.value)} required placeholder="Username"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-white/30"/>
          <input value={password} onChange={e=>setPassword(e.target.value)} required type="password" placeholder="Password"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-white/30"/>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button disabled={loading} className="w-full rounded-xl bg-white px-4 py-3 font-medium text-black disabled:opacity-50">
            {loading ? "Entering..." : "Enter"}
          </button>
        </div>
        <p className="mt-6 text-center text-sm text-white/45">New here? <Link className="text-white underline" href="/signup">Create an account</Link></p>
      </form>
    </main>
  );
}
