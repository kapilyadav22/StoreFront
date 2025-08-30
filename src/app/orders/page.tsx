"use client";


import { useQuery } from "@tanstack/react-query";
import { formatPrice } from "@/data/products";

export default function OrdersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => fetch("/api/orders").then((r) => r.json()),
  });

  const orders = data || [];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Your Orders</h1>
      {isLoading ? (
        <p className="mt-6 text-foreground/70">Loading…</p>
      ) : orders.length === 0 ? (
        <p className="mt-6 text-foreground/70">No orders yet.</p>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {orders.map((o: any) => (
            <div key={o.id} className="rounded-xl border border-black/5 dark:border-white/10 p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">Order {o.id}</div>
                <div className="text-sm text-foreground/70">{new Date(o.createdAt).toLocaleString()}</div>
              </div>
              <div className="mt-2 text-sm">Provider: {o.provider}</div>
              <div className="mt-4 flex flex-col gap-2">
                {o.items.map((i: any) => (
                  <div key={i.id} className="flex items-center justify-between text-sm">
                    <div className="truncate">{i.name} × {i.quantity}</div>
                    <div>{formatPrice(i.priceCents * i.quantity)}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-black/5 dark:border-white/10 pt-3">
                <div className="text-sm text-foreground/70">Total</div>
                <div className="font-medium">{formatPrice(o.totalCents)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


