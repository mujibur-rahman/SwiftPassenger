import { apiSlice } from "@/features/api/apiSlice";

export const rentalApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // List available cars (supports query filters)
    getRentalCars: builder.query({
      query: (params = {}) => {
        const q = new URLSearchParams();
        if (params.category && params.category !== "all")
          q.set("category", params.category);
        if (params.minPrice) q.set("minPrice", params.minPrice);
        if (params.maxPrice) q.set("maxPrice", params.maxPrice);
        if (params.transmission && params.transmission !== "all")
          q.set("transmission", params.transmission);
        if (params.seats) q.set("seats", params.seats);
        if (params.pickupDate) q.set("pickupDate", params.pickupDate);
        if (params.returnDate) q.set("returnDate", params.returnDate);
        const qs = q.toString();
        return `/rental/cars${qs ? `?${qs}` : ""}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "RentalCar", id })),
              { type: "RentalCar", id: "LIST" },
            ]
          : [{ type: "RentalCar", id: "LIST" }],
    }),

    // Single car details
    getRentalCarById: builder.query({
      query: (id) => `/rental/cars/${id}`,
      providesTags: (result, error, id) => [{ type: "RentalCar", id }],
    }),

    // Create booking
    createRentalBooking: builder.mutation({
      query: (body) => ({
        url: "/rental/bookings",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "RentalBooking", id: "LIST" },
        { type: "RentalCar", id: "LIST" },
      ],
    }),

    // My bookings
    getMyRentalBookings: builder.query({
      query: () => "/rental/bookings",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "RentalBooking", id })),
              { type: "RentalBooking", id: "LIST" },
            ]
          : [{ type: "RentalBooking", id: "LIST" }],
    }),

    // Single booking
    getRentalBookingById: builder.query({
      query: (id) => `/rental/bookings/${id}`,
      providesTags: (result, error, id) => [{ type: "RentalBooking", id }],
    }),

    // Cancel booking
    cancelRentalBooking: builder.mutation({
      query: (id) => ({
        url: `/rental/bookings/${id}/cancel`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "RentalBooking", id },
        { type: "RentalBooking", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetRentalCarsQuery,
  useLazyGetRentalCarsQuery,
  useGetRentalCarByIdQuery,
  useCreateRentalBookingMutation,
  useGetMyRentalBookingsQuery,
  useGetRentalBookingByIdQuery,
  useCancelRentalBookingMutation,
} = rentalApi;
