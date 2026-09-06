import { apiSlice } from "@/features/api/apiSlice";

export const foodApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // রেস্টুরেন্ট সার্চ
    searchRestaurants: builder.query({
      query: (q) => `/food/restaurants${q ? `?q=${encodeURIComponent(q)}` : ""}`,
      providesTags: ["Restaurant"],
    }),

    // রেস্টুরেন্ট + মেনু
    getRestaurant: builder.query({
      query: (id) => `/food/restaurants/${id}`,
      providesTags: (result, error, id) => [{ type: "Restaurant", id }],
    }),

    // অফার লিস্ট
    getOffers: builder.query({
      query: () => "/food/offers",
      providesTags: ["Offer"],
    }),

    // ডেলিভারি অপশন
    getDeliveryOptions: builder.query({
      query: () => "/food/delivery-options",
      providesTags: ["DeliveryOption"],
    }),

    // অর্ডার প্লেস
    placeOrder: builder.mutation({
      query: (orderData) => ({
        url: "/food/orders",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["ActiveOrder"],
    }),

    // অ্যাকটিভ অর্ডার (ট্র্যাকিং)
    getActiveOrder: builder.query({
      query: () => "/food/orders/active",
      providesTags: ["ActiveOrder"],
    }),

    // অর্ডার হিস্টোরি
    getOrderHistory: builder.query({
      query: () => "/food/orders/history",
      providesTags: ["FoodOrder"],
    }),
  }),
});

export const {
  useSearchRestaurantsQuery,
  useGetRestaurantQuery,
  useGetOffersQuery,
  useGetDeliveryOptionsQuery,
  usePlaceOrderMutation,
  useGetActiveOrderQuery,
  useGetOrderHistoryQuery,
} = foodApi;
