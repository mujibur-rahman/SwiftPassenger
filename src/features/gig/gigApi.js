import { apiSlice } from "@/features/api/apiSlice";

// এখনও ব্যাকএন্ড এন্ডপয়েন্ট রেডি নেই — কিন্তু endpoints এখানে scaffold করা আছে
// যাতে backend তৈরি হলে শুধু query/url বদলালেই কাজ হয়ে যায়। এখন screens এই hooks
// call না করে gigSlice-এর mock/demo reducers (postJob, receiveQuotes, confirmBooking,
// submitReview) দিয়েই ফ্লো চালাবে — pattern টা TrackOrderScreen-এর demo effect এর মতো।
export const gigApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // জব পোস্ট
        postGigJob: builder.mutation({
            query: (jobData) => ({
                url: "/gig/jobs",
                method: "POST",
                body: jobData,
            }),
            invalidatesTags: ["GigJob"],
        }),

        // পোস্ট করা জবের জন্য কোট লিস্ট
        getQuotes: builder.query({
            query: (jobId) => `/gig/jobs/${jobId}/quotes`,
            providesTags: ["Quote"],
        }),

        // বুকিং কনফার্ম
        confirmGigBooking: builder.mutation({
            query: (bookingData) => ({
                url: "/gig/bookings",
                method: "POST",
                body: bookingData,
            }),
            invalidatesTags: ["Booking"],
        }),

        // রেটিং/রিভিউ সাবমিট
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
    useGetQuotesQuery,
    useConfirmGigBookingMutation,
    useSubmitGigReviewMutation,
} = gigApi;
