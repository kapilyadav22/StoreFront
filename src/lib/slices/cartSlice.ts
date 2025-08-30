
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/data/products";

export type CartItem = { product: Product; quantity: number };
export type CartState = { items: CartItem[] };

const initialState: CartState = { items: [] };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<{ product: Product; quantity?: number }>) {
      const { product, quantity = 1 } = action.payload;
      const idx = state.items.findIndex((i) => i.product.id === product.id);
      if (idx >= 0) {
        state.items[idx].quantity += quantity;
      } else {
        state.items.push({ product, quantity });
      }
    },
    updateQuantity(state, action: PayloadAction<{ productId: string; quantity: number }>) {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter((i) => i.product.id !== productId);
        return;
      }
      const idx = state.items.findIndex((i) => i.product.id === productId);
      if (idx >= 0) state.items[idx].quantity = quantity;
    },
    removeFromCart(state, action: PayloadAction<{ productId: string }>) {
      state.items = state.items.filter((i) => i.product.id !== action.payload.productId);
    },
    clearCart(state) {
      state.items = [];
    },
    setCart(state, action: PayloadAction<CartState>) {
      return action.payload;
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;
