import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Search criteria
  search: {
    pickupLocation: "",
    pickupCoords: null,
    dropoffLocation: "",
    dropoffCoords: null,
    pickupDate: null, // ISO string
    returnDate: null,
    pickupTime: "10:00",
    returnTime: "10:00",
  },
  // Filters
  filters: {
    category: "all",
    minPrice: 0,
    maxPrice: 50000,
    transmission: "all", // all | Automatic | Manual
    seats: 0, // 0 = any
  },
  // Selected car for booking
  selectedCar: null,
  // Add-ons chosen by user { [addonId]: true/false }
  selectedAddons: {},
  // Pricing breakdown
  pricing: {
    days: 1,
    baseTotal: 0,
    addonsTotal: 0,
    tax: 0,
    grandTotal: 0,
  },
  // Payment
  paymentMethod: "bkash",
  promoCode: "",
  promoDiscount: 0,
  // Current booking (after confirm)
  currentBooking: null,
  // List of user's bookings (mock / from API)
  myBookings: [],
};

function daysBetween(startIso, endIso) {
  if (!startIso || !endIso) return 1;
  const start = new Date(startIso);
  const end = new Date(endIso);
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff);
}

function recalculatePricing(state) {
  const car = state.selectedCar;
  if (!car) {
    state.pricing = {
      days: 1,
      baseTotal: 0,
      addonsTotal: 0,
      tax: 0,
      grandTotal: 0,
    };
    return;
  }
  const days = daysBetween(state.search.pickupDate, state.search.returnDate);
  const baseTotal = car.pricePerDay * days;

  let addonsTotal = 0;
  Object.entries(state.selectedAddons).forEach(([id, enabled]) => {
    if (!enabled) return;
    // prices come from constant; we store only ids here
    const prices = {
      extra_driver: 500,
      child_seat: 300,
      gps: 200,
      full_insurance: 800,
      wifi: 250,
    };
    addonsTotal += (prices[id] || 0) * days;
  });

  const subtotal = baseTotal + addonsTotal - (state.promoDiscount || 0);
  const tax = Math.round(subtotal * 0.05); // 5% service tax
  const grandTotal = Math.max(0, subtotal + tax);

  state.pricing = { days, baseTotal, addonsTotal, tax, grandTotal };
}

const rentalSlice = createSlice({
  name: "rental",
  initialState,
  reducers: {
    setSearch(state, action) {
      state.search = { ...state.search, ...action.payload };
      recalculatePricing(state);
    },
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters(state) {
      state.filters = initialState.filters;
    },
    setSelectedCar(state, action) {
      state.selectedCar = action.payload;
      state.selectedAddons = {};
      state.promoCode = "";
      state.promoDiscount = 0;
      recalculatePricing(state);
    },
    toggleAddon(state, action) {
      const id = action.payload;
      state.selectedAddons[id] = !state.selectedAddons[id];
      recalculatePricing(state);
    },
    setPaymentMethod(state, action) {
      state.paymentMethod = action.payload;
    },
    applyPromo(state, action) {
      const code = (action.payload || "").toUpperCase().trim();
      state.promoCode = code;
      // Simple promo rules
      if (code === "SWIFT10") {
        state.promoDiscount = Math.round(state.pricing.baseTotal * 0.1);
      } else if (code === "RENT500") {
        state.promoDiscount = 500;
      } else {
        state.promoDiscount = 0;
      }
      recalculatePricing(state);
    },
    clearPromo(state) {
      state.promoCode = "";
      state.promoDiscount = 0;
      recalculatePricing(state);
    },
    setCurrentBooking(state, action) {
      state.currentBooking = action.payload;
    },
    addBooking(state, action) {
      state.myBookings.unshift(action.payload);
    },
    setMyBookings(state, action) {
      state.myBookings = action.payload || [];
    },
    clearRentalDraft(state) {
      state.selectedCar = null;
      state.selectedAddons = {};
      state.pricing = initialState.pricing;
      state.paymentMethod = "bkash";
      state.promoCode = "";
      state.promoDiscount = 0;
      state.currentBooking = null;
    },
  },
});

export const {
  setSearch,
  setFilters,
  resetFilters,
  setSelectedCar,
  toggleAddon,
  setPaymentMethod,
  applyPromo,
  clearPromo,
  setCurrentBooking,
  addBooking,
  setMyBookings,
  clearRentalDraft,
} = rentalSlice.actions;

export const selectRentalSearch = (s) => s.rental.search;
export const selectRentalFilters = (s) => s.rental.filters;
export const selectSelectedCar = (s) => s.rental.selectedCar;
export const selectSelectedAddons = (s) => s.rental.selectedAddons;
export const selectRentalPricing = (s) => s.rental.pricing;
export const selectPaymentMethod = (s) => s.rental.paymentMethod;
export const selectCurrentBooking = (s) => s.rental.currentBooking;
export const selectMyBookings = (s) => s.rental.myBookings;

export default rentalSlice.reducer;
