"use client";

import { formatPrice } from "@/data/products";
import type { Product } from "@/data/products";
import AddToCartButton from "./purchase";
import { useEffect, useState } from "react";
import { useAppDispatch, useWishlistSelector } from "@/lib/store";
import { addToRecentlyViewed } from "@/lib/slices/recentlyViewedSlice";
import { addToWishlist, removeFromWishlist } from "@/lib/slices/wishlistSlice";
import { useToast } from "@/lib/toast";
import ReviewsSection from "@/components/ReviewsSection";
import ImageGallery from "@/components/ImageGallery";
import ProductVariants from "@/components/ProductVariants";
import type { ProductVariant } from "@/data/products";

export default function ProductDetailClient({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const wishlistItems = useWishlistSelector((s) => s.items);
  const inWishlist = wishlistItems.find((p) => p.id === product.id);
  const { addToast } = useToast();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>();

  useEffect(() => {
    dispatch(addToRecentlyViewed(product));
  }, [product, dispatch]);

  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
  };

  const isProductAvailable = selectedVariant ? selectedVariant.inStock : product.inStock;

  return (
    <>
      <div className="grid md:grid-cols-2 gap-10">
        <div className="relative">
          <ImageGallery images={product.images || [product.imageUrl]} />
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{product.name}</h1>
          <div className="mt-2 text-xl font-medium">{formatPrice(product.priceCents)}</div>
          <p className="mt-6 text-foreground/80 leading-relaxed">{product.description}</p>
          <div className="mt-3 text-sm text-foreground/60">Category: {product.category}</div>
          
          {product.variants && product.variants.length > 0 && (
            <div className="mt-6">
              <ProductVariants
                variants={product.variants}
                onVariantSelect={handleVariantSelect}
                selectedVariant={selectedVariant}
              />
            </div>
          )}
          
          {!isProductAvailable && (
            <p className="mt-4 text-sm text-red-600 dark:text-red-400">
              This product is currently out of stock
            </p>
          )}
          
          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>
          
          <button
            onClick={() => {
              if (inWishlist) {
                dispatch(removeFromWishlist({ productId: product.id }));
                addToast({ title: "Removed from wishlist", description: product.name, variant: "info" });
              } else {
                dispatch(addToWishlist(product));
                addToast({ title: "Added to wishlist", description: product.name, variant: "success" });
              }
            }}
            className="mt-4 w-full px-5 py-3 rounded-md border border-black/10 dark:border-white/20 font-medium hover:bg-black/5 dark:hover:bg-white/10 transition"
          >
            {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          </button>
        </div>
      </div>
      
      <ReviewsSection productId={product.id} />
    </>
  );
}
