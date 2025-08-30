"use client";


import ProductCard from "@/components/ProductCard";
import { useWishlistSelector, useAppDispatch } from "@/lib/store";
import { removeFromWishlist } from "@/lib/slices/wishlistSlice";
import { useToast } from "@/lib/toast";

export default function WishlistPage() {
  const items = useWishlistSelector((s) => s.items);
  const dispatch = useAppDispatch();
  const { addToast } = useToast();

  const handleRemoveAll = () => {
    items.forEach((item) => {
      dispatch(removeFromWishlist({ productId: item.id }));
    });
    addToast({ title: "Wishlist cleared", variant: "info" });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-end justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">Wishlist</h1>
        {items.length > 0 && (
          <button
            onClick={handleRemoveAll}
            className="text-sm text-red-600 hover:text-red-700"
          >
            Clear all
          </button>
        )}
      </div>
      {items.length === 0 ? (
        <p className="mt-8 text-foreground/70">Your wishlist is empty. Start adding items you love!</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
