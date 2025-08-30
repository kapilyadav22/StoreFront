"use client";


import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";

import cartReducer, {
  clearCart,
  setCart,
  CartState,
} from "@/lib/slices/cartSlice";
import wishlistReducer, {
  setWishlist,
  WishlistState,
} from "@/lib/slices/wishlistSlice";
import recentlyViewedReducer, {
  setRecentlyViewed,
  RecentlyViewedState,
} from "@/lib/slices/recentlyViewedSlice";
import {
  GUEST_USER_KEY,
  CART_KEY_PREFIX,
  WISHLIST_KEY_PREFIX,
  RECENTLY_VIEWED_KEY_PREFIX,
} from "@/lib/constants";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    recentlyViewed: recentlyViewedReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export function useAppDispatch(): AppDispatch {
  return useDispatch<AppDispatch>();
}


export function useCartSelector<T>(selector: (state: CartState) => T): T {
  return useSelector((state: RootState) => selector(state.cart));
}

export function useWishlistSelector<T>(selector: (state: WishlistState) => T): T {
  return useSelector((state: RootState) => selector(state.wishlist));
}

export function useRecentlyViewedSelector<T>(selector: (state: RecentlyViewedState) => T): T {
  return useSelector((state: RootState) => selector(state.recentlyViewed));
}

// Re-export cart actions
export { addToCart, updateQuantity, removeFromCart, clearCart, setCart } from "@/lib/slices/cartSlice";

// Re-export wishlist actions
export { addToWishlist, removeFromWishlist, setWishlist } from "@/lib/slices/wishlistSlice";

// Re-export recently viewed actions
export { addToRecentlyViewed, setRecentlyViewed } from "@/lib/slices/recentlyViewedSlice";

export function usePersistCart() {
  const [hydrated, setHydrated] = useState(false);
  const items = useCartSelector((s) => s.items);
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const userKey = useMemo(() => {
    const id = (session?.user as any)?.id || session?.user?.email || GUEST_USER_KEY;
    return `${CART_KEY_PREFIX}${id}`;
  }, [session]);
  const prevUserKey = useRef<string | null>(null);


    useEffect(() => {
      try {
        const raw = localStorage.getItem(userKey);
        if (raw) {
          dispatch(setCart({ items: JSON.parse(raw) }));
        } else {
          dispatch(clearCart());
        }
      } catch {
        dispatch(clearCart());
      }
      setHydrated(true);
      prevUserKey.current = userKey;
    }, [userKey, dispatch]);


    useEffect(() => {
      if (!hydrated) return;
      try {
        localStorage.setItem(userKey, JSON.stringify(items));
      } catch {}
    }, [items, hydrated, userKey]);
}

export function usePersistWishlist() {
  const [hydrated, setHydrated] = useState(false);
  const items = useWishlistSelector((s) => s.items);
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const userKey = useMemo(() => {
    const id = (session?.user as any)?.id || session?.user?.email || GUEST_USER_KEY;
    return `${WISHLIST_KEY_PREFIX}${id}`;
  }, [session]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(userKey);
      if (raw) {
        dispatch(setWishlist({ items: JSON.parse(raw) }));
      }
    } catch {}
    setHydrated(true);
  }, [userKey, dispatch]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(userKey, JSON.stringify(items));
    } catch {}
  }, [items, hydrated, userKey]);
}

export function usePersistRecentlyViewed() {
  const [hydrated, setHydrated] = useState(false);
  const items = useRecentlyViewedSelector((s) => s.items);
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const userKey = useMemo(() => {
    const id = (session?.user as any)?.id || session?.user?.email || GUEST_USER_KEY;
    return `${RECENTLY_VIEWED_KEY_PREFIX}${id}`;
  }, [session]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(userKey);
      if (raw) {
        dispatch(setRecentlyViewed({ items: JSON.parse(raw) }));
      }
    } catch {}
    setHydrated(true);
  }, [userKey, dispatch]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(userKey, JSON.stringify(items));
    } catch {}
  }, [items, hydrated, userKey]);
}


