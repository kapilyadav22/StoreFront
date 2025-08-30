"use client";


import ProductCard from "@/components/ProductCard";
import { products as allProducts } from "@/data/products";
import { useMemo, useState } from "react";

const PAGE_SIZE = 8;

export default function ProductsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("relevance");
  const [page, setPage] = useState(1);
  const categories = useMemo(() => ["All", ...Array.from(new Set(allProducts.map((p) => p.category)))], []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = allProducts.filter((p) =>
      (category === "All" || p.category === category) &&
      (q === "" || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || (p.tags || []).some((t) => t.toLowerCase().includes(q)))
    );
    if (sort === "price-asc") list = [...list].sort((a, b) => a.priceCents - b.priceCents);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.priceCents - a.priceCents);
    if (sort === "name-asc") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "name-desc") list = [...list].sort((a, b) => b.name.localeCompare(a.name));
    return list;
  }, [query, category, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function resetPage() { setPage(1); }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">All Products</h1>
        <div className="flex flex-col sm:flex-row gap-3 md:items-center">
          <input value={query} onChange={(e) => { setQuery(e.target.value); resetPage(); }} placeholder="Search products" className="px-3 py-2 rounded-md border border-black/10 dark:border-white/20 bg-transparent" />
          <select value={category} onChange={(e) => { setCategory(e.target.value); resetPage(); }} className="px-3 py-2 rounded-md border border-black/10 dark:border-white/20 bg-transparent">
            {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
          </select>
          <select value={sort} onChange={(e) => { setSort(e.target.value); resetPage(); }} className="px-3 py-2 rounded-md border border-black/10 dark:border-white/20 bg-transparent">
            <option value="relevance">Sort: Relevance</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {pageItems.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-3">
        <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-2 rounded-md border border-black/10 dark:border-white/20 disabled:opacity-50">Prev</button>
        <div className="text-sm">Page {page} of {totalPages}</div>
        <button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="px-3 py-2 rounded-md border border-black/10 dark:border-white/20 disabled:opacity-50">Next</button>
      </div>
    </div>
  );
}


