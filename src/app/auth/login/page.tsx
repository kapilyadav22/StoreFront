"use client";


import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { useToast } from "@/lib/toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.ok) {
      addToast({ title: "Welcome back!", variant: "success" });
      window.location.href = "/";
    } else {
      addToast({ title: "Login failed", description: "Check your credentials", variant: "error" });
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Log in</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <input aria-label="Email" type="email" className="w-full px-3 py-2 rounded-md border border-black/10 dark:border-white/20 bg-transparent" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input aria-label="Password" type="password" className="w-full px-3 py-2 rounded-md border border-black/10 dark:border-white/20 bg-transparent" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button disabled={loading} className="w-full px-4 py-2 rounded-md bg-black text-white dark:bg-white dark:text-black disabled:opacity-60">{loading ? "Signing in…" : "Sign in"}</button>
      </form>
      <div className="mt-6">
        <button onClick={() => signIn("google", { callbackUrl: "/" })} className="w-full px-4 py-2 rounded-md border border-black/10 dark:border-white/20">Continue with Google</button>
      </div>
      <p className="mt-4 text-sm">No account? <Link href="/auth/signup" className="underline hover:no-underline">Sign up</Link></p>
    </div>
  );
}


