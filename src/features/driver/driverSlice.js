// src/features/driver/driverSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOnline: false,
  currentLocation: null,
  incomingRide: null, // pending decision
  activeRide: null, // accepted / ongoing
  rideStatus: "idle", // idle | incoming | accepted | arrived | ongoing | completed
  passenger: null,
  error: null,
  todayStats: { trips: 0, earnings: 0, hours: 0 },
};

const driverSlice = createSlice({
  name: "driver",
  initialState,
  reducers: {
    setOnlineStatus: (state, action) => {
      state.isOnline = action.payload;
    },
    setCurrentLocation: (state, action) => {
      state.currentLocation = action.payload;
    },
    setIncomingRide: (state, action) => {
      state.incomingRide = action.payload;
      state.rideStatus = "incoming";
    },
    clearIncomingRide: (state) => {
      state.incomingRide = null;
      if (state.rideStatus === "incoming") state.rideStatus = "idle";
    },
    setPassenger: (state, action) => {
      state.passenger = action.payload;
    },
    setRideStatus: (state, action) => {
      state.rideStatus = action.payload;
    },
    setActiveRide: (state, action) => {
      state.activeRide = action.payload;
    },
    updateTodayStats: (state, action) => {
      state.todayStats = { ...state.todayStats, ...action.payload };
    },
    // After successful accept
    rideAccepted: (state, action) => {
      const { ride, passenger } = action.payload;
      state.activeRide = ride;
      state.passenger = passenger || null;
      state.rideStatus = "accepted";
      state.incomingRide = null;
      state.error = null;
    },
    // After start
    rideStarted: (state, action) => {
      state.activeRide = action.payload?.ride || state.activeRide;
      state.rideStatus = "ongoing";
    },
    // After complete
    rideCompleted: (state, action) => {
      state.rideStatus = "completed";
      const fare = action.payload?.ride?.fare || 0;
      state.todayStats.trips += 1;
      state.todayStats.earnings += fare;
    },
    // Recover from server
    recoverRide: (state, action) => {
      if (action.payload?.ride) {
        state.activeRide = action.payload.ride;
        state.passenger = action.payload.passenger || null;
        state.rideStatus = action.payload.ride.status || "accepted";
        state.isOnline = true;
      }
    },
    clearActiveRide: (state) => {
      state.activeRide = null;
      state.passenger = null;
      state.rideStatus = "idle";
      state.incomingRide = null;
      state.error = null;
    },
    resetActiveRide: (state) => {
      state.activeRide = null;
      state.passenger = null;
      state.rideStatus = "idle";
      state.incomingRide = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setOnlineStatus,
  setCurrentLocation,
  setIncomingRide,
  clearIncomingRide,
  setPassenger,
  setRideStatus,
  setActiveRide,
  updateTodayStats,
  rideAccepted,
  rideStarted,
  rideCompleted,
  recoverRide,
  clearActiveRide,
  resetActiveRide,
  setError,
} = driverSlice.actions;

export default driverSlice.reducer;
