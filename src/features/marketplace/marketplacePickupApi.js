import { apiSlice } from "@/features/api/apiSlice";

export const marketplacePickupApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Options / recent sellers etc.
    getMarketplacePickupOptions: builder.query({
      query: () => "/marketplace/pickup/options",
      providesTags: ["MarketplacePickup"],
    }),

    // Fare / distance estimate
    getMarketplacePickupEstimate: builder.mutation({
      query: (body) => ({
        url: "/marketplace/pickup/estimate",
        method: "POST",
        body,
      }),
    }),

    // Create pickup request
    createMarketplacePickup: builder.mutation({
      query: (body) => ({
        url: "/marketplace/pickup/request",
        method: "POST",
        body,
      }),
      invalidatesTags: ["MarketplacePickup", "ActivePickup"],
    }),

    // Active pickup for current user
    getActiveMarketplacePickup: builder.query({
      query: () => "/marketplace/pickup/active",
      providesTags: ["ActivePickup"],
    }),

    // Single pickup (tracking)
    getMarketplacePickup: builder.query({
      query: (id) => `/marketplace/pickup/${id}`,
      providesTags: (result, error, id) => [{ type: "MarketplacePickup", id }],
    }),

    // Cancel
    cancelMarketplacePickup: builder.mutation({
      query: (id) => ({
        url: `/marketplace/pickup/${id}/cancel`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "MarketplacePickup", id },
        "ActivePickup",
      ],
    }),

    // Optional item verification at seller
    verifyMarketplacePickup: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/marketplace/pickup/${id}/verify`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "MarketplacePickup", id }],
    }),

    // Rating
    rateMarketplacePickup: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/marketplace/pickup/${id}/rating`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "MarketplacePickup", id }],
    }),
  }),
});

export const {
  useGetMarketplacePickupOptionsQuery,
  useGetMarketplacePickupEstimateMutation,
  useCreateMarketplacePickupMutation,
  useGetActiveMarketplacePickupQuery,
  useGetMarketplacePickupQuery,
  useCancelMarketplacePickupMutation,
  useVerifyMarketplacePickupMutation,
  useRateMarketplacePickupMutation,
} = marketplacePickupApi;
