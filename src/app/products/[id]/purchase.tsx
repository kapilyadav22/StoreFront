"use client";

import { useState } from "react";
import type { Product } from "@/data/products";
import { useMemo } from "react";
import { useCartSelector, useAppDispatch, addToCart, updateQuantity, removeFromCart } from "@/lib/store";
import { useToast } from "@/lib/toast";

export default function AddToCartButton({ product }: { product: Product }) {
  const items = useCartSelector((s) => s.items);
  const dispatch = useAppDispatch();
  const inCart = useMemo(() => items.find((i) => i.product.id === product.id), [items, product.id]);
  const [quantity, setQuantity] = useState<number>(1);
  const [bump, setBump] = useState<boolean>(false);
  const { addToast } = useToast();

  return (
    <div className={`flex items-center gap-3 ${bump ? "animate-bump" : ""}`} onAnimationEnd={() => setBump(false)}>
      {inCart ? (
        <>
          <div className="inline-flex items-center rounded-md border border-black/10 dark:border-white/20">
            <button className="px-3 py-2" onClick={() => { dispatch(updateQuantity({ productId: product.id, quantity: (inCart?.quantity || 1) - 1 })); setBump(true); }} aria-label="Decrease quantity">−</button>
            <input className="w-12 text-center bg-transparent py-2 outline-none" type="number" min={0} value={inCart.quantity} onChange={(e) => { dispatch(updateQuantity({ productId: product.id, quantity: Math.max(0, Number(e.target.value) || 0) })); setBump(true); }} />
            <button className="px-3 py-2" onClick={() => { dispatch(updateQuantity({ productId: product.id, quantity: (inCart?.quantity || 1) + 1 })); setBump(true); }} aria-label="Increase quantity">+</button>
          </div>
          <button className="text-sm text-red-600" onClick={() => { dispatch(removeFromCart({ productId: product.id })); addToast({ title: "Removed from cart", description: product.name, variant: "info" }); }}>Remove</button>
        </>
      ) : (
        <button
          onClick={() => { dispatch(addToCart({ product, quantity })); setBump(true); addToast({ title: "Added to cart", description: product.name, variant: "success" }); }}
          className="px-5 py-3 rounded-md bg-black text-white dark:bg-white dark:text-black font-medium"
        >
          Add to cart
        </button>
      )}
    </div>
  );
}


