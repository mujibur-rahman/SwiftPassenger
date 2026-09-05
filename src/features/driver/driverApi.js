// src/features/driver/driverApi.js
import { apiSlice } from "@/features/api/apiSlice";

export const driverApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    acceptRide: builder.mutation({
      query: (rideId) => ({
        url: `/rides/${rideId}/accept`,
        method: "POST",
      }),
      invalidatesTags: ["ActiveRide"],
    }),

    rejectRide: builder.mutation({
      query: (rideId) => ({
        url: `/rides/${rideId}/reject`,
        method: "POST",
      }),
    }),

    startRide: builder.mutation({
      query: (rideId) => ({
        url: `/rides/${rideId}/start`,
        method: "POST",
      }),
      invalidatesTags: ["ActiveRide"],
    }),

    completeRide: builder.mutation({
      query: (rideId) => ({
        url: `/rides/${rideId}/complete`,
        method: "POST",
      }),
      invalidatesTags: ["ActiveRide", "Ride"],
    }),

    // ✅ renamed – was conflicting with rideApi.getActiveRide
    getDriverActiveRide: builder.query({
      query: () => "/drivers/active-ride",
      providesTags: ["ActiveRide"],
    }),

    setDriverOnline: builder.mutation({
      query: (isOnline) => ({
        url: "/drivers/status",
        method: "PATCH",
        body: { isOnline },
      }),
    }),

    updateDriverPreference: builder.mutation({
      query: (body) => ({
        url: "/drivers/me",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Driver"],
    }),
  }),
});

export const {
  useAcceptRideMutation,
  useRejectRideMutation,
  useStartRideMutation,
  useCompleteRideMutation,
  useGetDriverActiveRideQuery,      // ✅ updated
  useLazyGetDriverActiveRideQuery,  // ✅ updated
  useSetDriverOnlineMutation,
  useUpdateDriverPreferenceMutation,
} = driverApi;
