// src/features/driver/driverApi.js
import { apiSlice } from "../api/apiSlice";

export const driverApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Accept ride
    acceptRide: builder.mutation({
      query: (rideId) => ({
        url: `/rides/${rideId}/accept`,
        method: "POST",
      }),
      invalidatesTags: ["ActiveRide"],
    }),

    // Reject ride
    rejectRide: builder.mutation({
      query: (rideId) => ({
        url: `/rides/${rideId}/reject`,
        method: "POST",
      }),
    }),

    // Start ride
    startRide: builder.mutation({
      query: (rideId) => ({
        url: `/rides/${rideId}/start`,
        method: "POST",
      }),
      invalidatesTags: ["ActiveRide"],
    }),

    // Complete ride
    completeRide: builder.mutation({
      query: (rideId) => ({
        url: `/rides/${rideId}/complete`,
        method: "POST",
      }),
      invalidatesTags: ["ActiveRide", "Ride"],
    }),

    // Recover active ride (on app restart)
    getActiveRide: builder.query({
      query: () => "/drivers/active-ride",
      providesTags: ["ActiveRide"],
    }),

    // Optional: go online / offline
    setDriverOnline: builder.mutation({
      query: (isOnline) => ({
        url: "/drivers/status",
        method: "PATCH",
        body: { isOnline },
      }),
    }),
  }),
});

export const {
  useAcceptRideMutation,
  useRejectRideMutation,
  useStartRideMutation,
  useCompleteRideMutation,
  useGetActiveRideQuery,
  useLazyGetActiveRideQuery,
  useSetDriverOnlineMutation,
} = driverApi;
