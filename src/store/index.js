// passenger-app/src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import rideReducer from './slices/rideSlice';
import locationReducer from './slices/locationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ride: rideReducer,
    location: locationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
