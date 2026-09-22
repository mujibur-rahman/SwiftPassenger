import { createSlice } from "@reduxjs/toolkit";

/**
 * Client / UI state only — mirrors marketplacePickupSlice.js's shape
 * exactly (draft / estimate / activeId / trackingStatus), domain-renamed.
 * Server state lives in RTK Query cache (parcelDeliveryApi.js).
 */
const initialState = {
  draft: {
    // Pickup
    pickupAddress: null, // { address, latitude, longitude, placeId? }

    // Delivery
    deliveryAddress: null,
    receiverPhone: "",

    // Parcel details
    description: "",
    quantity: 1,
    category: "",
    approximateValue: "",
    notes: "",
    isFragile: false,
    photos: [],

    // Size & weight
    size: "", // "small" | "medium" | "large" | "extra_large"
    weight: "", // preset key or numeric string

    // Sender
    senderName: "",
    senderPhone: "",
    pickupInstructions: "",

    // Receiver
    receiverName: "",
    deliveryInstructions: "",

    // Delivery option + payment
    deliveryOption: null, // { id, label, etaMinutes, extraFee }
    paymentMethod: null,
  },

  estimate: null, // { fare, distanceKm, durationMin, currency, serviceFee, deliveryFee, additionalFee }
  activeParcelId: null,
  trackingStatus: "idle",
};

const parcelDeliverySlice = createSlice({
  name: "parcelDelivery",
  initialState,
  reducers: {
    setDraftField: (state, action) => {
      const { key, value } = action.payload;
      state.draft[key] = value;
    },
    setPickupAddress: (state, action) => {
      state.draft.pickupAddress = action.payload;
    },
    setDeliveryAddress: (state, action) => {
      state.draft.deliveryAddress = action.payload;
    },
    setEstimate: (state, action) => {
      state.estimate = action.payload;
    },
    setActiveParcelId: (state, action) => {
      state.activeParcelId = action.payload;
    },
    setTrackingStatus: (state, action) => {
      state.trackingStatus = action.payload;
    },
    resetParcelDelivery: () => initialState,
  },
});

export const {
  setDraftField,
  setPickupAddress,
  setDeliveryAddress,
  setEstimate,
  setActiveParcelId,
  setTrackingStatus,
  resetParcelDelivery,
} = parcelDeliverySlice.actions;

export default parcelDeliverySlice.reducer;

export const selectParcelDraft = (state) => state.parcelDelivery.draft;
export const selectParcelEstimate = (state) => state.parcelDelivery.estimate;
export const selectActiveParcelId = (state) => state.parcelDelivery.activeParcelId;
export const selectParcelTrackingStatus = (state) => state.parcelDelivery.trackingStatus;
