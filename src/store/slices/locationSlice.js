// passenger-app/src/store/slices/locationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const locationSlice = createSlice({
  name: 'location',
  initialState: {
    currentLocation: null,
    pickup: null,
    destination: null,
    pickupAddress: '',
    destinationAddress: '',
  },
  reducers: {
    setCurrentLocation: (state, action) => { state.currentLocation = action.payload; },
    setPickup: (state, action) => {
      state.pickup = action.payload.coords;
      state.pickupAddress = action.payload.address;
    },
    setDestination: (state, action) => {
      state.destination = action.payload.coords;
      state.destinationAddress = action.payload.address;
    },
    clearLocations: (state) => {
      state.pickup = null;
      state.destination = null;
      state.pickupAddress = '';
      state.destinationAddress = '';
    },
  },
});

export const { setCurrentLocation, setPickup, setDestination, clearLocations } = locationSlice.actions;
export default locationSlice.reducer;
