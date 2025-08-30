"use client";


import { useState } from "react";
import Link from "next/link";
import { createUser } from "@/lib/users";
import { useToast } from "@/lib/toast";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      // Call an API route instead of direct import to avoid server/client boundary issues
      const res = await fetch("/api/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, name, password }) });
      if (!res.ok) throw new Error("Signup failed");
      const data = await res.json();
      addToast({ title: "Verify your email", description: "Click the verification link sent (shown next)", variant: "info" });
      window.location.href = `/auth/verify/sent?url=${encodeURIComponent(data.verifyUrl)}`;
    } catch (e: any) {
      addToast({ title: "Signup failed", description: e?.message || "Try again", variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Sign up</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <input aria-label="Name" className="w-full px-3 py-2 rounded-md border border-black/10 dark:border-white/20 bg-transparent" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
        <input aria-label="Email" type="email" className="w-full px-3 py-2 rounded-md border border-black/10 dark:border-white/20 bg-transparent" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input aria-label="Password" type="password" className="w-full px-3 py-2 rounded-md border border-black/10 dark:border-white/20 bg-transparent" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button disabled={loading} className="w-full px-4 py-2 rounded-md bg-black text-white dark:bg-white dark:text-black disabled:opacity-60">{loading ? "Creating…" : "Create account"}</button>
      </form>
      <p className="mt-4 text-sm">Already have an account? <Link href="/auth/login" className="underline hover:no-underline">Log in</Link></p>
    </div>
  );
}


