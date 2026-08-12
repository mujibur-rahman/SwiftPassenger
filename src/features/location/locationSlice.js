import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentLocation: null, // { latitude, longitude, ... }
  pickup: null, // { latitude, longitude }
  destination: null, // { latitude, longitude }
  pickupAddress: "",
  destinationAddress: "",
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setCurrentLocation: (state, action) => {
      state.currentLocation = action.payload;
    },
    setPickup: (state, action) => {
      state.pickup = action.payload.coords;
      state.pickupAddress = action.payload.address || "";
    },
    setDestination: (state, action) => {
      state.destination = action.payload.coords;
      state.destinationAddress = action.payload.address || "";
    },
    clearLocations: (state) => {
      state.pickup = null;
      state.destination = null;
      state.pickupAddress = "";
      state.destinationAddress = "";
    },
    resetLocation: () => initialState,
  },
});

export const {
  setCurrentLocation,
  setPickup,
  setDestination,
  clearLocations,
  resetLocation,
} = locationSlice.actions;

export default locationSlice.reducer;
