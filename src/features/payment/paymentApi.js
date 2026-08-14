// src/features/payment/paymentApi.js
import { apiSlice } from "../api/apiSlice";

export const paymentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET list — cached, auto-refetch on focus / reconnect
    getPaymentMethods: builder.query({
      query: () => "/passengers/payment-methods",
      transformResponse: (res) => res?.methods ?? res ?? [],
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ id }) => ({ type: "PaymentMethods", id })),
              { type: "PaymentMethods", id: "LIST" },
            ]
          : [{ type: "PaymentMethods", id: "LIST" }],
    }),

    // Set default card
    setDefaultPaymentMethod: builder.mutation({
      query: (id) => ({
        url: `/passengers/payment-methods/${id}/default`,
        method: "PATCH",
      }),
      // Optimistic update
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          paymentApi.util.updateQueryData(
            "getPaymentMethods",
            undefined,
            (draft) => {
              draft.forEach((m) => {
                m.isDefault = m.id === id;
              });
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: [{ type: "PaymentMethods", id: "LIST" }],
    }),

    // Delete card
    deletePaymentMethod: builder.mutation({
      query: (id) => ({
        url: `/passengers/payment-methods/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          paymentApi.util.updateQueryData(
            "getPaymentMethods",
            undefined,
            (draft) => {
              const idx = draft.findIndex((m) => m.id === id);
              if (idx !== -1) draft.splice(idx, 1);
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: (result, error, id) => [
        { type: "PaymentMethods", id },
        { type: "PaymentMethods", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetPaymentMethodsQuery,
  useSetDefaultPaymentMethodMutation,
  useDeletePaymentMethodMutation,
} = paymentApi;
