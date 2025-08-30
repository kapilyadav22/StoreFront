
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/data/products";

export type WishlistState = { items: Product[] };

const initialState: WishlistState = { items: [] };

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist(state, action: PayloadAction<Product>) {
      if (!state.items.find((p) => p.id === action.payload.id)) {
        state.items.push(action.payload);
      }
    },
    removeFromWishlist(state, action: PayloadAction<{ productId: string }>) {
      state.items = state.items.filter((p) => p.id !== action.payload.productId);
    },
    setWishlist(state, action: PayloadAction<WishlistState>) {
      return action.payload;
    },
  },
});

export const { addToWishlist, removeFromWishlist, setWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
