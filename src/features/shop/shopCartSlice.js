import { createSlice, createSelector } from "@reduxjs/toolkit";

// Mirrors @/features/food/cartSlice.js's shape (restaurantId/items/offer),
// but Shop items have no fixed price the way a menu item does — the
// shopper finds the real price in-store — so there's no subtotal/discount
// selector here. budgetLimit replaces "the sum of item prices" as the
// number the customer actually commits to.
const initialState = {
  storeId: null,
  storeName: null,
  storeCategory: null,
  storeDistanceKm: null,
  items: [], // { id, name, qty, unit, note }
  budgetLimit: 25, // matches the $5–$100 slider default shown in the design
  substitutionPreference: "suggest_similar", // "suggest_similar" | "call_me"
};

const shopCartSlice = createSlice({
  name: "shopCart",
  initialState,
  reducers: {
    setStore: (state, action) => {
      const { storeId, storeName, category, distanceKm } = action.payload;
      if (state.storeId && state.storeId !== storeId) {
        state.items = [];
      }
      state.storeId = storeId;
      state.storeName = storeName;
      state.storeCategory = category ?? null;
      state.storeDistanceKm = distanceKm ?? null;
    },

    addItem: (state, action) => {
      const { name, qty = 1, unit = "", note = "" } = action.payload;
      state.items.push({
        id: `item_${Date.now()}_${Math.round(Math.random() * 1000)}`,
        name,
        qty,
        unit,
        note,
      });
    },

    updateItem: (state, action) => {
      const { id, ...changes } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) Object.assign(item, changes);
    },

    incrementItem: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.qty += 1;
    },

    decrementItem: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (!item) return;
      item.qty -= 1;
      if (item.qty <= 0) {
        state.items = state.items.filter((i) => i.id !== action.payload);
      }
    },

    removeItem: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },

    setBudgetLimit: (state, action) => {
      state.budgetLimit = Number(action.payload) || 0;
    },

    setSubstitutionPreference: (state, action) => {
      state.substitutionPreference = action.payload;
    },

    clearShopCart: () => initialState,
  },
});

export const {
  setStore,
  addItem,
  updateItem,
  incrementItem,
  decrementItem,
  removeItem,
  setBudgetLimit,
  setSubstitutionPreference,
  clearShopCart,
} = shopCartSlice.actions;

export default shopCartSlice.reducer;

export const selectShopCart = (state) => state.shopCart;

export const selectShopItemCount = createSelector(selectShopCart, (cart) =>
  cart.items.reduce((sum, i) => sum + i.qty, 0)
);

// No price data pre-shopping, so "can checkout" only depends on having at
// least one item and a budget worth holding — see the guard rule in
// ShopListBuilderScreen.
export const selectCanContinue = createSelector(
  selectShopCart,
  (cart) => cart.items.length > 0 && cart.budgetLimit > 0
);
