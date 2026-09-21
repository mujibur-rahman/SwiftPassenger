import { apiSlice } from "@/features/api/apiSlice";

// Mirrors @/features/food/foodApi.js's endpoint shapes.
export const shopApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // কাছের স্টোর সার্চ — category: "nearby" | "groceries" | "pharmacy"
    searchStores: builder.query({
      query: ({ q, category } = {}) => {
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (category) params.set("category", category);
        const qs = params.toString();
        return `/shop/stores${qs ? `?${qs}` : ""}`;
      },
      providesTags: ["ShopStore"],
    }),

    // অর্ডার প্লেস — items + budgetLimit + substitutionPreference + address
    placeShopOrder: builder.mutation({
      query: (orderData) => ({
        url: "/shop/orders",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["ActiveShopOrder"],
    }),

    // অ্যাকটিভ অর্ডার (লাইভ শপিং ট্র্যাকিং)
    getActiveShopOrder: builder.query({
      query: () => "/shop/orders/active",
      providesTags: ["ActiveShopOrder"],
    }),

    // শপার থেকে আসা substitute অনুরোধে কাস্টমারের সাড়া
    respondToSubstitute: builder.mutation({
      query: ({ orderId, itemId, approved }) => ({
        url: `/shop/${orderId}/items/${itemId}/substitute-response`,
        method: "POST",
        body: { approved },
      }),
    }),

    // অর্ডার হিস্টোরি
    getShopOrderHistory: builder.query({
      query: () => "/shop/orders/history",
      providesTags: ["ShopOrder"],
    }),

    getShopOrderById: builder.query({
      query: (id) => `/shop/orders/${id}`,
      providesTags: ["ShopOrder"],
    }),

    // শপারকে রেটিং
    rateShopOrder: builder.mutation({
      query: ({ orderId, rating, tags, comment }) => ({
        url: `/shop/orders/${orderId}/rate`,
        method: "POST",
        body: { rating, tags, comment },
      }),
      invalidatesTags: ["ShopOrder"],
    }),
  }),
});

export const {
  useSearchStoresQuery,
  usePlaceShopOrderMutation,
  useGetActiveShopOrderQuery,
  useRespondToSubstituteMutation,
  useGetShopOrderHistoryQuery,
  useGetShopOrderByIdQuery,
  useRateShopOrderMutation,
} = shopApi;
