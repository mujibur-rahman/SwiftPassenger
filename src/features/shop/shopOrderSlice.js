import { createSlice } from "@reduxjs/toolkit";

/**
 * Mirrors @/features/food/foodOrderSlice.js's currentOrder/orderStatus/
 * rider shape, but food's status is a plain linear string
 * (idle→confirmed→preparing→on_the_way→delivered) because nothing about
 * a food order needs customer input mid-flight. Shop needs more:
 *  - a live per-item list (shoppingItems) the shopper updates in real
 *    time, each with its own status
 *  - a runningTotal that only exists once shopping starts (there's no
 *    price before that)
 *  - pendingSubstitute — a single in-flight substitute request the
 *    customer must approve/skip before the shopper can move on
 *
 * orderStatus: idle | searching | assigned | to_store | shopping | checkout | purchased | delivering | delivered
 * — matches auth_server/auth-server.js's real status list exactly; the
 * server owns progression now, this slice just mirrors it in via
 * hydrateShopOrder() on every poll tick.
 * shoppingItems[].status: pending | found | substituted | skipped
 */
const initialState = {
  currentOrder: null,
  orderStatus: "idle",
  shopper: null,
  shoppingItems: [],
  runningTotal: 0,
  pendingSubstitute: null, // { itemId, itemName, suggestedName, suggestedPrice }
  eta: null, // { minutes, distanceKm } — set once status reaches "delivering"
};

const recalcTotal = (items = []) =>
  items.reduce((sum, item) => {
    if (item.status === "found" || item.status === "substituted") {
      const unitPrice = Number(item.actualPrice) || 0;
      return sum + unitPrice * (item.qty || 1);
    }
    return sum;
  }, 0);

const shopOrderSlice = createSlice({
  name: "shopOrder",
  initialState,
  reducers: {
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    updateOrderStatus: (state, action) => {
      state.orderStatus = action.payload;
    },
    setShopper: (state, action) => {
      state.shopper = action.payload;
    },
    // Seeds the live checklist once a shopper is assigned — from the
    // items the customer built in ShopListBuilderScreen, each starting
    // "pending".
    setShoppingItems: (state, action) => {
      state.shoppingItems = (action.payload || []).map((it) => ({
        ...it,
        status: "pending",
        actualPrice: null,
        substitutedWith: null,
      }));
      state.runningTotal = 0;
    },
    updateShoppingItemStatus: (state, action) => {
      const { itemId, status, actualPrice, substitutedWith } = action.payload;
      const item = state.shoppingItems.find((i) => i.id === itemId);
      if (!item) return;
      item.status = status;
      if (actualPrice !== undefined) item.actualPrice = actualPrice;
      if (substitutedWith !== undefined) item.substitutedWith = substitutedWith;
      state.runningTotal = recalcTotal(state.shoppingItems);
    },
    setPendingSubstitute: (state, action) => {
      state.pendingSubstitute = action.payload;
    },
    clearPendingSubstitute: (state) => {
      state.pendingSubstitute = null;
    },
    // The real server (auth_server/auth-server.js) now owns order state —
    // it advances status, resolves items, and flags substitutes on its own
    // timers. This one reducer syncs the whole order in from a poll tick
    // (getActiveShopOrder), replacing the old pattern of dispatching each
    // field separately after a local optimistic update.
    hydrateShopOrder: (state, action) => {
      const order = action.payload;
      if (!order) return;
      state.currentOrder = order;
      state.orderStatus = order.status;
      state.shopper = order.shopper || null;
      state.shoppingItems = order.items || [];
      state.runningTotal = order.actualTotal ?? state.runningTotal;
      state.pendingSubstitute = order.pendingSubstitute || null;
      state.eta = order.eta || null;
    },
    resetShopOrder: () => initialState,
  },
});

export const {
  setCurrentOrder,
  updateOrderStatus,
  setShopper,
  setShoppingItems,
  updateShoppingItemStatus,
  setPendingSubstitute,
  clearPendingSubstitute,
  hydrateShopOrder,
  resetShopOrder,
} = shopOrderSlice.actions;

export default shopOrderSlice.reducer;

export const selectAllItemsResolved = (state) =>
  state.shopOrder.shoppingItems.length > 0 &&
  state.shopOrder.shoppingItems.every((i) => i.status !== "pending");
