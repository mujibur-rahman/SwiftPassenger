import { apiSlice } from "../api/apiSlice";

export const rideApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // রাইড রিকোয়েস্ট
    requestRide: builder.mutation({
      query: (rideData) => ({
        url: "/rides/request",
        method: "POST",
        body: rideData,
      }),
      invalidatesTags: ["ActiveRide"],
    }),

    // ক্যান্সেল
    cancelRide: builder.mutation({
      query: (rideId) => ({
        url: `/rides/${rideId}/cancel`,
        method: "POST",
      }),
      invalidatesTags: ["ActiveRide", "Ride"],
    }),

    // ফেয়ার এস্টিমেট
    getFareEstimate: builder.mutation({
      query: ({ origin, destination }) => ({
        url: "/rides/estimate",
        method: "POST",
        body: { origin, destination },
      }),
    }),

    // অ্যাকটিভ রাইড
    getActiveRide: builder.query({
      query: () => "/rides/active",
      providesTags: ["ActiveRide"],
    }),

    // হিস্টোরি
    getRideHistory: builder.query({
      query: () => "/rides/history",
      providesTags: ["Ride"],
    }),

    // রেটিং সাবমিট
    submitRating: builder.mutation({
      query: ({ rideId, rating, review }) => ({
        url: `/rides/${rideId}/rating`,
        method: "POST",
        body: { rating, review },
      }),
      invalidatesTags: ["Ride"],
    }),
  }),
});

export const {
  useRequestRideMutation,
  useCancelRideMutation,
  useGetFareEstimateMutation,
  useGetActiveRideQuery,
  useGetRideHistoryQuery,
  useSubmitRatingMutation,
} = rideApi;
