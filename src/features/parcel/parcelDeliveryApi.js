import { apiSlice } from "@/features/api/apiSlice";

// Mirrors marketplacePickupApi.js's endpoint shapes exactly.
export const parcelDeliveryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getParcelDeliveryOptions: builder.query({
      query: () => "/parcel/options",
      providesTags: ["ParcelDelivery"],
    }),

    getParcelDeliveryEstimate: builder.mutation({
      query: (body) => ({
        url: "/parcel/estimate",
        method: "POST",
        body,
      }),
    }),

    createParcelDelivery: builder.mutation({
      query: (body) => ({
        url: "/parcel/deliveries",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ParcelDelivery", "ActiveParcelDelivery"],
    }),

    getActiveParcelDelivery: builder.query({
      query: () => "/parcel/deliveries/active",
      providesTags: ["ActiveParcelDelivery"],
    }),

    getParcelDelivery: builder.query({
      query: (id) => `/parcel/deliveries/${id}`,
      providesTags: (result, error, id) => [{ type: "ParcelDelivery", id }],
    }),

    cancelParcelDelivery: builder.mutation({
      query: (id) => ({
        url: `/parcel/deliveries/${id}/cancel`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "ParcelDelivery", id },
        "ActiveParcelDelivery",
      ],
    }),

    verifyParcelPickup: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/parcel/deliveries/${id}/verify-pickup`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "ParcelDelivery", id }],
    }),

    rateParcelDelivery: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/parcel/deliveries/${id}/rating`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "ParcelDelivery", id }],
    }),
  }),
});

export const {
  useGetParcelDeliveryOptionsQuery,
  useGetParcelDeliveryEstimateMutation,
  useCreateParcelDeliveryMutation,
  useGetActiveParcelDeliveryQuery,
  useGetParcelDeliveryQuery,
  useCancelParcelDeliveryMutation,
  useVerifyParcelPickupMutation,
  useRateParcelDeliveryMutation,
} = parcelDeliveryApi;
