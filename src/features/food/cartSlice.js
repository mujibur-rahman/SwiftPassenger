import { createSlice, createSelector } from "@reduxjs/toolkit";

const initialState = {
  restaurantId: null,
  restaurantName: null,
  items: [], // { menuItemId, name, price, qty, note }
  offer: null, // { code, title, type, value, maxDiscount, minSpend }
  deliveryOptionId: "standard",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // অন্য রেস্টুরেন্ট থেকে অ্যাড করলে আগের কার্ট ক্লিয়ার হয়ে নতুন করে শুরু হয়
    addItem: (state, action) => {
      const { restaurantId, restaurantName, menuItemId, name, price, qty = 1, note = "" } =
        action.payload;

      if (state.restaurantId && state.restaurantId !== restaurantId) {
        state.items = [];
        state.offer = null;
      }

      state.restaurantId = restaurantId;
      state.restaurantName = restaurantName;

      const existing = state.items.find(
        (i) => i.menuItemId === menuItemId && i.note === note
      );
      if (existing) {
        existing.qty += qty;
      } else {
        state.items.push({ menuItemId, name, price, qty, note });
      }
    },

    incrementItem: (state, action) => {
      const item = state.items.find((i) => i.menuItemId === action.payload);
      if (item) item.qty += 1;
    },

    decrementItem: (state, action) => {
      const item = state.items.find((i) => i.menuItemId === action.payload);
      if (!item) return;
      item.qty -= 1;
      if (item.qty <= 0) {
        state.items = state.items.filter((i) => i.menuItemId !== action.payload);
      }
    },

    removeItem: (state, action) => {
      state.items = state.items.filter((i) => i.menuItemId !== action.payload);
    },

    setOffer: (state, action) => {
      state.offer = action.payload; // pass null to clear
    },

    setDeliveryOption: (state, action) => {
      state.deliveryOptionId = action.payload;
    },

    clearCart: (state) => {
      state.restaurantId = null;
      state.restaurantName = null;
      state.items = [];
      state.offer = null;
      state.deliveryOptionId = "standard";
    },
  },
});

export const {
  addItem,
  incrementItem,
  decrementItem,
  removeItem,
  setOffer,
  setDeliveryOption,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

// ---------- Selectors ----------
export const selectCart = (state) => state.cart;

export const selectCartCount = createSelector(selectCart, (cart) =>
  cart.items.reduce((sum, i) => sum + i.qty, 0)
);

export const selectSubtotal = createSelector(selectCart, (cart) =>
  cart.items.reduce((sum, i) => sum + i.price * i.qty, 0)
);

export const selectDiscount = createSelector(
  selectCart,
  selectSubtotal,
  (cart, subtotal) => {
    const offer = cart.offer;
    if (!offer || subtotal < (offer.minSpend || 0)) return 0;
    if (offer.type === "percent") {
      const raw = (subtotal * offer.value) / 100;
      return offer.maxDiscount ? Math.min(raw, offer.maxDiscount) : raw;
    }
    if (offer.type === "flat") return offer.value;
    return 0; // free_delivery handled via deliveryFee below
  }
);

export const makeSelectTotals = (deliveryFee = 2.0, serviceFee = 0.99) =>
  createSelector(
    selectCart,
    selectSubtotal,
    selectDiscount,
    (cart, subtotal, discount) => {
      const freeDelivery = cart.offer?.type === "free_delivery" && subtotal >= (cart.offer.minSpend || 0);
      const effectiveDeliveryFee = freeDelivery ? 0 : deliveryFee;
      const total = Math.max(0, subtotal - discount + effectiveDeliveryFee + serviceFee);
      return {
        subtotal,
        discount,
        deliveryFee: effectiveDeliveryFee,
        serviceFee,
        total,
      };
    }
  );
