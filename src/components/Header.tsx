"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartSelector } from "@/lib/store";
import { formatPrice } from "@/data/products";
import { useSession, signOut } from "next-auth/react";
import SearchAutocomplete from "./SearchAutocomplete";

export default function Header() {
  const pathname = usePathname();
  const items = useCartSelector((s) => s.items);
  const count = items.reduce((n, i) => n + i.quantity, 0);
  const totalCents = items.reduce((sum, i) => sum + i.product.priceCents * i.quantity, 0);
  const { data: session } = useSession();

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10 transition ${
        pathname === href ? "bg-black/5 dark:bg-white/10" : ""
      }`}
    >
      {children}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-background/70 border-b border-black/5 dark:border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-semibold tracking-tight">Storefront</Link>
        
        <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-8">
          <SearchAutocomplete />
        </div>
        
        <nav className="hidden md:flex items-center gap-1">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/products">Products</NavLink>
          <NavLink href="/wishlist">Wishlist</NavLink>
          <NavLink href="/cart">Cart</NavLink>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/orders">Orders</NavLink>
          {session ? (
            <button onClick={() => signOut({ callbackUrl: "/" })} className="px-3 py-2 rounded-md text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10 transition">Logout</button>
          ) : (
            <NavLink href="/auth/login">Login</NavLink>
          )}
        </nav>
        <Link href="/cart" className="ml-4 inline-flex items-center gap-2 px-3 py-2 rounded-md bg-black text-white dark:bg-white dark:text-black text-sm">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 dark:bg-black/20">{count}</span>
          <span className="hidden sm:inline">{formatPrice(totalCents)}</span>
        </Link>
      </div>
    </header>
  );
}


