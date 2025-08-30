"use client";

import { useCartSelector, useAppDispatch } from "@/lib/store";
import { updateQuantity as setQty, removeFromCart as removeItem, clearCart as clearAll } from "@/lib/slices/cartSlice";
import { formatPrice } from "@/data/products";
import Link from "next/link";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { validateDiscountCode, calculateDiscount, type DiscountCode } from "@/lib/discounts";
import { useToast } from "@/lib/toast";

export default function CartPage() {
  const items = useCartSelector((s) => s.items);
  const dispatch = useAppDispatch();
  const totalCents = items.reduce((sum, i) => sum + i.product.priceCents * i.quantity, 0);
  const [loading, setLoading] = useState(false);
  const [bumpId, setBumpId] = useState<string | null>(null);
  const [showPay, setShowPay] = useState(false);
  const [provider, setProvider] = useState<"stripe" | "justpay">("stripe");
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(null);
  const [discountError, setDiscountError] = useState("");
  const { addToast } = useToast();

  const discountAmount = appliedDiscount ? calculateDiscount(appliedDiscount, totalCents) : 0;
  const finalTotal = totalCents - discountAmount;

  async function handleCheckout() {
    try {
      setLoading(true);
      // Save current items for order creation on success
      sessionStorage.setItem("checkout:items", JSON.stringify(items.map(({ product, quantity }) => ({ id: product.id, name: product.name, priceCents: product.priceCents, quantity }))));
      sessionStorage.setItem("checkout:total", String(finalTotal));
      sessionStorage.setItem("checkout:provider", provider);

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(({ product, quantity }) => ({
            name: product.name,
            priceCents: product.priceCents,
            quantity,
          })),
          provider,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout error");
      if (provider === "stripe") {
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");
        if (!stripe) throw new Error("Stripe failed to load");
        await stripe.redirectToCheckout({ sessionId: data.id });
      } else {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
      alert("Unable to start checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) return;
    
    const result = validateDiscountCode(discountCode, totalCents);
    if (result.valid && result.discount) {
      setAppliedDiscount(result.discount);
      setDiscountError("");
      addToast({ title: "Discount applied", description: `${result.discount.type === "percentage" ? result.discount.value + "%" : "$" + (result.discount.value / 100).toFixed(2)} off`, variant: "success" });
    } else {
      setDiscountError(result.error || "Invalid discount code");
      addToast({ title: "Invalid discount code", description: result.error, variant: "error" });
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode("");
    setDiscountError("");
    addToast({ title: "Discount removed", variant: "info" });
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Your cart is empty</h1>
        <p className="mt-4 text-foreground/70">Browse our collection and add something you love.</p>
        <Link href="/products" className="inline-block mt-8 px-5 py-3 rounded-md bg-black text-white dark:bg-white dark:text-black font-medium">Shop products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Your Cart</h1>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 flex flex-col gap-4">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className={`flex items-center justify-between gap-4 rounded-xl border border-black/5 dark:border-white/10 p-4 ${bumpId === product.id ? "animate-bump" : ""}`} onAnimationEnd={() => setBumpId(null)}>
              <div className="min-w-0">
                <div className="font-medium truncate">{product.name}</div>
                <div className="text-sm text-foreground/70">{formatPrice(product.priceCents)}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center rounded-md border border-black/10 dark:border-white/20">
                  <button className="px-3 py-2" onClick={() => { dispatch(setQty({ productId: product.id, quantity: quantity - 1 })); setBumpId(product.id); }} aria-label="Decrease quantity">
                    −
                  </button>
                  <input className="w-12 text-center bg-transparent py-2 outline-none" type="number" value={quantity} min={0} onChange={(e) => { dispatch(setQty({ productId: product.id, quantity: Math.max(0, Number(e.target.value) || 0) })); setBumpId(product.id); }} />
                  <button className="px-3 py-2" onClick={() => { dispatch(setQty({ productId: product.id, quantity: quantity + 1 })); setBumpId(product.id); }} aria-label="Increase quantity">
                    +
                  </button>
                </div>
                <button className="text-sm text-red-600" onClick={() => { dispatch(removeItem({ productId: product.id })); setBumpId(product.id); }}>Remove</button>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-black/5 dark:border-white/10 p-6 h-fit">
          {/* Discount Code */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Discount Code</h3>
            {appliedDiscount ? (
              <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
                <span className="text-sm text-green-700 dark:text-green-300">{appliedDiscount.code}</span>
                <button onClick={handleRemoveDiscount} className="text-sm text-green-600 hover:text-green-700">Remove</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-md border border-black/10 dark:border-white/20 bg-transparent text-sm"
                />
                <button
                  onClick={handleApplyDiscount}
                  className="px-3 py-2 rounded-md bg-black text-white dark:bg-white dark:text-black text-sm"
                >
                  Apply
                </button>
              </div>
            )}
            {discountError && <p className="mt-1 text-xs text-red-600">{discountError}</p>}
          </div>

          {/* Order Summary */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-foreground/70">Subtotal</span>
              <span>{formatPrice(totalCents)}</span>
            </div>
            {appliedDiscount && (
              <div className="flex items-center justify-between text-green-600">
                <span>Discount ({appliedDiscount.code})</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="border-t border-black/10 dark:border-white/20 pt-2 flex items-center justify-between font-medium">
              <span>Total</span>
              <span>{formatPrice(finalTotal)}</span>
            </div>
          </div>
          
          <p className="mt-2 text-xs text-foreground/60">Taxes and shipping calculated at checkout.</p>
          <button onClick={() => setShowPay(true)} className="mt-6 w-full px-5 py-3 rounded-md bg-black text-white dark:bg-white dark:text-black font-medium">Checkout</button>
          <button onClick={() => dispatch(clearAll())} className="mt-3 w-full px-5 py-3 rounded-md border border-black/10 dark:border-white/20 font-medium">Clear cart</button>
        </div>
      </div>

      {showPay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowPay(false)} />
          <div className="relative z-10 w-full max-w-md rounded-xl bg-background p-6 shadow-lg">
            <h2 className="text-lg font-semibold">Choose payment method</h2>
            <div className="mt-4 space-y-3">
              <label className="flex items-center justify-between rounded-md border border-black/10 dark:border-white/20 p-3">
                <span>Stripe</span>
                <input type="radio" name="provider" value="stripe" checked={provider === "stripe"} onChange={() => setProvider("stripe")} />
              </label>
              <label className="flex items-center justify-between rounded-md border border-black/10 dark:border-white/20 p-3">
                <span>JustPay</span>
                <input type="radio" name="provider" value="justpay" checked={provider === "justpay"} onChange={() => setProvider("justpay")} />
              </label>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <button onClick={handleCheckout} disabled={loading} className="px-5 py-3 rounded-md bg-black text-white dark:bg-white dark:text-black font-medium disabled:opacity-60">{loading ? "Processing..." : "Continue"}</button>
              <button onClick={() => setShowPay(false)} className="px-5 py-3 rounded-md border border-black/10 dark:border-white/20 font-medium">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


