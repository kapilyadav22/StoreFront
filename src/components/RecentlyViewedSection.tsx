"use client";

import ProductCard from "@/components/ProductCard";
import { useRecentlyViewedSelector } from "@/lib/store";

export default function RecentlyViewedSection() {
  const items = useRecentlyViewedSelector((s) => s.items);

  if (items.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Recently viewed</h2>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
