"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";

export default function SuccessPage() {
  const { clearCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const rawItems = sessionStorage.getItem("checkout:items");
        const rawTotal = sessionStorage.getItem("checkout:total");
        const provider = (sessionStorage.getItem("checkout:provider") as any) || "unknown";
        if (rawItems && rawTotal) {
          await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: JSON.parse(rawItems), totalCents: Number(rawTotal), provider }),
          });
        }
      } catch {}
      clearCart();
      sessionStorage.removeItem("checkout:items");
      sessionStorage.removeItem("checkout:total");
      sessionStorage.removeItem("checkout:provider");
    })();
  }, [clearCart]);

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">Thank you for your purchase!</h1>
      <p className="mt-4 text-foreground/70">Your order has been placed successfully. A receipt was sent to your email.</p>
      <div className="mt-8 flex justify-center gap-4">
        <Link href="/products" className="px-5 py-3 rounded-md bg-black text-white dark:bg-white dark:text-black font-medium">Continue shopping</Link>
        <Link href="/" className="px-5 py-3 rounded-md border border-black/10 dark:border-white/20 font-medium">Go to home</Link>
      </div>
    </div>
  );
}


