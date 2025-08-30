"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function JustPayContent() {
  const router = useRouter();
  const search = useSearchParams();
  const [processing, setProcessing] = useState(false);

  const amount = Number(search.get("amount") || 0);
  const sid = search.get("sid") || "";

  async function simulatePay(success: boolean) {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1200));
    router.push(success ? "/cart/success" : "/cart/cancel");
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">JustPay Checkout</h1>
      <p className="mt-2 text-sm text-foreground/70">Session: {sid}</p>
      <div className="mt-6 text-xl font-medium">Total: ${(amount / 100).toFixed(2)} USD</div>
      <div className="mt-8 grid grid-cols-1 gap-3">
        <button disabled={processing} onClick={() => simulatePay(true)} className="px-5 py-3 rounded-md bg-black text-white dark:bg-white dark:text-black font-medium disabled:opacity-60">Pay with JustPay</button>
        <button disabled={processing} onClick={() => simulatePay(false)} className="px-5 py-3 rounded-md border border-black/10 dark:border-white/20 font-medium disabled:opacity-60">Cancel</button>
        <Link href="/cart" className="text-sm underline hover:no-underline">Back to cart</Link>
      </div>
    </div>
  );
}

export default function JustPayPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto px-6 py-16 text-center">Loading...</div>}>
      <JustPayContent />
    </Suspense>
  );
}


