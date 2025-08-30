
import { findProductById, products } from "@/data/products";
import { notFound } from "next/navigation";
import AddToCartButton from "./purchase";
import ProductDetailClient from "./ProductDetailClient";

type Params = { params: { id: string } };

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export default function ProductDetailPage({ params }: Params) {
  const product = findProductById(params.id);
  if (!product) return notFound();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <ProductDetailClient product={product} />
    </div>
  );
}


