import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentRide: null,
  rideStatus: "idle", // idle | searching | accepted | pickup | ongoing | completed | cancelled
  fareEstimate: null,
  driver: null,
  driverLocation: null,
  eta: null,
  rating: null,
  // history RTK Query থেকে আসবে, তাই এখানে রাখিনি
};

const rideSlice = createSlice({
  name: "ride",
  initialState,
  reducers: {
    // Socket থেকে status আপডেট
    updateRideStatus: (state, action) => {
      state.rideStatus = action.payload;
    },

    // Socket থেকে ড্রাইভার লোকেশন
    updateDriverLocation: (state, action) => {
      state.driverLocation = action.payload;
    },

    setCurrentRide: (state, action) => {
      state.currentRide = action.payload;
    },

    setDriver: (state, action) => {
      state.driver = action.payload;
    },

    updateETA: (state, action) => {
      state.eta = action.payload;
    },

    setRating: (state, action) => {
      state.rating = action.payload;
    },

    setFareEstimate: (state, action) => {
      state.fareEstimate = action.payload;
    },

    // রাইড শেষ / ক্যান্সেল হলে সব ক্লিয়ার
    resetRide: (state) => {
      state.currentRide = null;
      state.rideStatus = "idle";
      state.driver = null;
      state.driverLocation = null;
      state.eta = null;
      state.fareEstimate = null;
      state.rating = null;
    },
  },
});

export const {
  updateRideStatus,
  updateDriverLocation,
  setCurrentRide,
  setDriver,
  updateETA,
  setRating,
  setFareEstimate,
  resetRide,
} = rideSlice.actions;

export default rideSlice.reducer;
