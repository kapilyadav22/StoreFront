"use client";


import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import type { Product } from "@/data/products";
import { formatPrice } from "@/data/products";

import { useToast } from "@/lib/toast";

import { useCartSelector, useWishlistSelector, useAppDispatch } from "@/lib/store";
import { addToCart, updateQuantity, removeFromCart } from "@/lib/slices/cartSlice";
import { addToWishlist, removeFromWishlist } from "@/lib/slices/wishlistSlice";


export default function ProductCard({ product }: { product: Product }) {
  const items = useCartSelector((s) => s.items);
  const wishlistItems = useWishlistSelector((s) => s.items);
  const dispatch = useAppDispatch();
  const [bump, setBump] = useState(false);
  const { addToast } = useToast();

  // Memoize selectors
  const inCart = useMemo(() => items.find((i) => i.product.id === product.id), [items, product.id]);
  const inWishlist = useMemo(() => wishlistItems.some((p) => p.id === product.id), [wishlistItems, product.id]);

  // Handlers
  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inWishlist) {
      dispatch(removeFromWishlist({ productId: product.id }));
      addToast({ title: "Removed from wishlist", description: product.name, variant: "info" });
    } else {
      dispatch(addToWishlist(product));
      addToast({ title: "Added to wishlist", description: product.name, variant: "success" });
    }
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity: 1 }));
    setBump(true);
    addToast({ title: "Added to cart", description: product.name, variant: "success" });
  };

  const handleRemoveFromCart = () => {
    dispatch(removeFromCart({ productId: product.id }));
    addToast({ title: "Removed from cart", description: product.name, variant: "info" });
  };

  const handleQuantityChange = (quantity: number) => {
    dispatch(updateQuantity({ productId: product.id, quantity }));
    setBump(true);
  };

  return (
    <div
      className={`group rounded-xl border border-black/5 dark:border-white/10 overflow-hidden bg-white dark:bg-black ${bump ? "animate-bump" : ""}`}
      onAnimationEnd={() => setBump(false)}
    >
      <Link href={`/products/${product.id}`} className="block relative aspect-[4/3] overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(min-width: 768px) 25vw, 100vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        {product.tag && (
          <span className="absolute left-3 top-3 text-xs px-2 py-1 rounded-full bg-black text-white dark:bg-white dark:text-black">
            {product.tag}
          </span>
        )}
        <button
          onClick={handleWishlist}
          className="absolute right-3 top-3 p-2 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur hover:bg-white dark:hover:bg-black transition"
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          tabIndex={0}
        >
          <svg
            className={`w-4 h-4 ${inWishlist ? "fill-red-500" : "fill-none"} stroke-current`}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-medium leading-tight">
              <Link href={`/products/${product.id}`}>{product.name}</Link>
            </h3>
            <p className="text-sm text-foreground/70 line-clamp-2 mt-1">{product.description}</p>
          </div>
          <div className="shrink-0 font-semibold">{formatPrice(product.priceCents)}</div>
        </div>
        {inCart ? (
          <div className="mt-4 flex items-center gap-3">
            <div className="inline-flex items-center rounded-md border border-black/10 dark:border-white/20">
              <button
                className="px-3 py-2"
                onClick={() => handleQuantityChange(Math.max(0, inCart.quantity - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <input
                className="w-12 text-center bg-transparent py-2 outline-none"
                type="number"
                min={0}
                value={inCart.quantity}
                onChange={(e) => handleQuantityChange(Math.max(0, Number(e.target.value) || 0))}
                aria-label="Cart quantity"
              />
              <button
                className="px-3 py-2"
                onClick={() => handleQuantityChange(inCart.quantity + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button
              onClick={handleRemoveFromCart}
              className="text-sm text-red-600"
              aria-label="Remove from cart"
            >
              Remove
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            className="mt-4 w-full rounded-md bg-black text-white dark:bg-white dark:text-black py-2 text-sm font-medium"
            aria-label="Add to cart"
          >
            Add to cart
          </button>
        )}
      </div>
    </div>
  );
}


