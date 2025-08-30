"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo } from "react";
import { usePersistCart, usePersistWishlist, usePersistRecentlyViewed } from "@/lib/store";
import { ToastProvider } from "@/lib/toast";
import { SessionProvider } from "next-auth/react";

function CartPersistence() {
  usePersistCart();
  return null;
}

function WishlistPersistence() {
  usePersistWishlist();
  return null;
}

function RecentlyViewedPersistence() {
  usePersistRecentlyViewed();
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = useMemo(() => new QueryClient(), []);
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <ToastProvider>
            <CartPersistence />
            <WishlistPersistence />
            <RecentlyViewedPersistence />
            {children}
          </ToastProvider>
        </SessionProvider>
      </QueryClientProvider>
    </Provider>
  );
}


