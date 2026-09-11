import { createSlice } from "@reduxjs/toolkit";

/**
 * Client / UI state only.
 * Server state lives in RTK Query cache.
 */
const initialState = {
  draft: {
    // Seller / pickup
    sellerName: "",
    sellerAddress: null, // { address, latitude, longitude, placeId? }
    marketplaceSource: "", // e.g. Facebook Marketplace, Daraz
    orderReference: "",
    sellerPhone: "",
    pickupInstructions: "",

    // Item
    itemDescription: "",
    itemQuantity: 1,
    itemCategory: "",
    approximateValue: "",
    itemNotes: "",
    photos: [],

    // Delivery
    deliveryAddress: null,
    receiverPhone: "",
  },

  estimate: null, // { fare, distanceKm, durationMin, currency, serviceFee?, deliveryFee? }
  activePickupId: null,
  trackingStatus: "idle",
};

const marketplacePickupSlice = createSlice({
  name: "marketplacePickup",
  initialState,
  reducers: {
    setDraftField: (state, action) => {
      const { key, value } = action.payload;
      state.draft[key] = value;
    },
    setSellerAddress: (state, action) => {
      state.draft.sellerAddress = action.payload;
    },
    setDeliveryAddress: (state, action) => {
      state.draft.deliveryAddress = action.payload;
    },
    setEstimate: (state, action) => {
      state.estimate = action.payload;
    },
    setActivePickupId: (state, action) => {
      state.activePickupId = action.payload;
    },
    setTrackingStatus: (state, action) => {
      state.trackingStatus = action.payload;
    },
    resetMarketplacePickup: () => initialState,
  },
});

export const {
  setDraftField,
  setSellerAddress,
  setDeliveryAddress,
  setEstimate,
  setActivePickupId,
  setTrackingStatus,
  resetMarketplacePickup,
} = marketplacePickupSlice.actions;

export default marketplacePickupSlice.reducer;

export const selectMarketplaceDraft = (state) => state.marketplacePickup.draft;
export const selectMarketplaceEstimate = (state) => state.marketplacePickup.estimate;
export const selectActivePickupId = (state) => state.marketplacePickup.activePickupId;
export const selectMarketplaceTrackingStatus = (state) =>
  state.marketplacePickup.trackingStatus;
