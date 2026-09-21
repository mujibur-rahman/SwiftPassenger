import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { apiSlice } from "@/features/api/apiSlice";
import authReducer from "@/features/auth/authSlice";
import rideReducer from "@/features/ride/rideSlice";
import locationReducer from "@/features/location/locationSlice";
import driverReducer from "@/features/driver/driverSlice";
import cartReducer from "@/features/food/cartSlice";
import foodOrderReducer from "@/features/food/foodOrderSlice";
import gigReducer from "@/features/gig/gigSlice";
import marketplacePickupReducer from "@/features/marketplace/marketplacePickupSlice";
import shopCartReducer from "@/features/shop/shopCartSlice";
import shopOrderReducer from "@/features/shop/shopOrderSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    ride: rideReducer,
    location: locationReducer,
    driver: driverReducer,
    cart: cartReducer,
    foodOrder: foodOrderReducer,
    gig: gigReducer,
    marketplacePickup: marketplacePickupReducer,
    shopCart: shopCartReducer,
    shopOrder: shopOrderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // location object এর জন্য দরকার      
      immutableCheck: false, // stop warning 
    }).concat(apiSlice.middleware),
});

setupListeners(store.dispatch);
