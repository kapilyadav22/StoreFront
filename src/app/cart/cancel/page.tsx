import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">Checkout cancelled</h1>
      <p className="mt-4 text-foreground/70">No worries—your cart is saved. You can try checking out again anytime.</p>
      <div className="mt-8 flex justify-center gap-4">
        <Link href="/cart" className="px-5 py-3 rounded-md bg-black text-white dark:bg-white dark:text-black font-medium">Back to cart</Link>
        <Link href="/products" className="px-5 py-3 rounded-md border border-black/10 dark:border-white/20 font-medium">Continue shopping</Link>
      </div>
    </div>
  );
}


