"use client";

import { useState } from "react";
import type { ProductVariant } from "@/data/products";

interface ProductVariantsProps {
  variants?: ProductVariant[];
  onVariantSelect?: (variant: ProductVariant) => void;
  selectedVariant?: ProductVariant;
}

export default function ProductVariants({ variants, onVariantSelect, selectedVariant }: ProductVariantsProps) {
  const [selected, setSelected] = useState<ProductVariant | undefined>(selectedVariant);

  if (!variants || variants.length === 0) return null;

  const handleVariantSelect = (variant: ProductVariant) => {
    setSelected(variant);
    onVariantSelect?.(variant);
  };

  const sizeVariants = variants.filter(v => v.type === "size");
  const colorVariants = variants.filter(v => v.type === "color");

  return (
    <div className="space-y-4">
      {sizeVariants.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2">Size</h3>
          <div className="flex gap-2">
            {sizeVariants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => handleVariantSelect(variant)}
                disabled={!variant.inStock}
                className={`px-4 py-2 rounded-md border text-sm font-medium transition ${
                  selected?.id === variant.id
                    ? "border-black dark:border-white bg-black text-white dark:bg-white dark:text-black"
                    : variant.inStock
                    ? "border-black/10 dark:border-white/20 hover:border-black/30 dark:hover:border-white/40"
                    : "border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                }`}
              >
                {variant.value}
              </button>
            ))}
          </div>
        </div>
      )}

      {colorVariants.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2">Color</h3>
          <div className="flex gap-2">
            {colorVariants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => handleVariantSelect(variant)}
                disabled={!variant.inStock}
                className={`relative w-10 h-10 rounded-full border-2 transition ${
                  selected?.id === variant.id
                    ? "border-black dark:border-white"
                    : variant.inStock
                    ? "border-black/10 dark:border-white/20 hover:border-black/30 dark:hover:border-white/40"
                    : "border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed"
                }`}
                style={{
                  backgroundColor: getColorValue(variant.value),
                }}
                title={`${variant.value}${!variant.inStock ? " - Out of stock" : ""}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Stock Status */}
      {selected && !selected.inStock && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {selected.value} is currently out of stock
        </p>
      )}
    </div>
  );
}

function getColorValue(colorName: string): string {
  const colorMap: Record<string, string> = {
    "Black": "#000000",
    "White": "#ffffff",
    "Navy": "#000080",
    "Gray": "#808080",
    "Brown": "#8B4513",
    "Tan": "#D2B48C",
    "Olive": "#808000",
    "Burgundy": "#800020",
    "Stainless": "#C0C0C0",
  };
  
  return colorMap[colorName] || "#cccccc";
}
