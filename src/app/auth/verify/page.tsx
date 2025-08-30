"use client";


import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useToast } from "@/lib/toast";

export default function VerifyPage() {
  const search = useSearchParams();
  const token = search.get("token") || "";
  const [status, setStatus] = useState<"pending" | "ok" | "error">("pending");
  const { addToast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/users/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) });
        if (!res.ok) throw new Error();
        setStatus("ok");
        addToast({ title: "Email verified", variant: "success" });
      } catch {
        setStatus("error");
        addToast({ title: "Verification failed", variant: "error" });
      }
    })();
  }, [token, addToast]);

  return (
    <div className="max-w-md mx-auto px-6 py-16 text-center">
      {status === "pending" && <p>Verifying…</p>}
      {status === "ok" && (
        <>
          <h1 className="text-2xl font-semibold tracking-tight">Email verified</h1>
          <p className="mt-4"><Link className="underline" href="/auth/login">Continue to login</Link></p>
        </>
      )}
      {status === "error" && (
        <>
          <h1 className="text-2xl font-semibold tracking-tight">Invalid or expired link</h1>
          <p className="mt-4"><Link className="underline" href="/auth/signup">Try signing up again</Link></p>
        </>
      )}
    </div>
  );
}


