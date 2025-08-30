

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/data/products";
import { MAX_RECENTLY_VIEWED } from "@/lib/constants";

export type RecentlyViewedState = { items: Product[] };

const initialState: RecentlyViewedState = { items: [] };

const recentlyViewedSlice = createSlice({
  name: "recentlyViewed",
  initialState,
  reducers: {
    addToRecentlyViewed(state, action: PayloadAction<Product>) {
      const existing = state.items.findIndex((p) => p.id === action.payload.id);
      if (existing >= 0) {
        state.items.splice(existing, 1);
      }
      state.items.unshift(action.payload);
      if (state.items.length > MAX_RECENTLY_VIEWED) {
        state.items = state.items.slice(0, MAX_RECENTLY_VIEWED);
      }
    },
    setRecentlyViewed(state, action: PayloadAction<RecentlyViewedState>) {
      return action.payload;
    },
  },
});

export const { addToRecentlyViewed, setRecentlyViewed } = recentlyViewedSlice.actions;
export default recentlyViewedSlice.reducer;
