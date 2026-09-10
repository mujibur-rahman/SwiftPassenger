import { apiSlice } from "@/features/api/apiSlice";

export const gigApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // ========== POST JOB ==========
        postGigJob: builder.mutation({
            query: (jobData) => ({
                url: "/gig/jobs",
                method: "POST",
                body: jobData,
            }),
            invalidatesTags: ["GigJob"],
        }),

        // ========== GET SINGLE JOB (status + quotes) ==========
        getGigJob: builder.query({
            query: (jobId) => `/gig/jobs/${jobId}`,
            providesTags: (result, error, id) => [{ type: "GigJob", id }],
        }),

        // ========== GET QUOTES FOR A JOB ==========
        getQuotes: builder.query({
            query: (jobId) => `/gig/jobs/${jobId}/quotes`,
            providesTags: (result, error, id) => [{ type: "Quote", id }],
        }),

        // ========== CONFIRM BOOKING ==========
        confirmGigBooking: builder.mutation({
            query: (bookingData) => ({
                url: "/gig/bookings",
                method: "POST",
                body: bookingData,
            }),
            invalidatesTags: ["Booking", "GigJob"],
        }),

        // ========== GET BOOKING (for tracking) ==========
        getGigBooking: builder.query({
            query: (bookingId) => `/gig/bookings/${bookingId}`,
            providesTags: (result, error, id) => [{ type: "Booking", id }],
        }),

        // ========== SUBMIT REVIEW ==========
        submitGigReview: builder.mutation({
            query: (reviewData) => ({
                url: "/gig/reviews",
                method: "POST",
                body: reviewData,
            }),
            invalidatesTags: ["Booking"],
        }),
    }),
});

export const {
    usePostGigJobMutation,
    useGetGigJobQuery,
    useGetQuotesQuery,
    useConfirmGigBookingMutation,
    useGetGigBookingQuery,
    useSubmitGigReviewMutation,
} = gigApi;
