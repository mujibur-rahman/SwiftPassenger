import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { apiSlice } from "../features/api/apiSlice";
import authReducer from "../features/auth/authSlice";
import rideReducer from "../features/ride/rideSlice";
import locationReducer from "../features/location/locationSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    ride: rideReducer,
    location: locationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // location object এর জন্য দরকার
    }).concat(apiSlice.middleware),
});

setupListeners(store.dispatch);