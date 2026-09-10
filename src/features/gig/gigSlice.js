import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    serviceId: null,
    answers: {}, // { [questionId]: optionId }
    contact: null, // { fullName, mobile, email, address, suburb, postcode, notes, photos }

    job: null, // full server job: { id, serviceId, answers, contact, status, quotes, createdAt }
    jobStatus: "idle", // idle | posted | waiting_quotes | quotes_ready

    quotes: [], // from server or socket
    selectedQuoteId: null,

    booking: null, // full server booking: { id, jobId, quoteId, provider, price, location, scheduledAt, status }
    bookingStatus: "idle", // idle | confirmed | on_the_way | arrived | started | completed

    review: null, // { id, rating, text, tags }
};

const gigSlice = createSlice({
    name: "gig",
    initialState,
    reducers: {
        // শুরু — সার্ভিস সিলেক্ট হলে আগের ড্রাফট রিসেট করে নতুন serviceId সেট করে
        startGigJob: (state, action) => {
            state.serviceId = action.payload;
            state.answers = {};
            state.contact = null;
            state.job = null;
            state.jobStatus = "idle";
            state.quotes = [];
            state.selectedQuoteId = null;
            state.booking = null;
            state.bookingStatus = "idle";
            state.review = null;
        },

        answerQuestion: (state, action) => {
            const { questionId, optionId } = action.payload;
            state.answers[questionId] = optionId;
        },

        setContact: (state, action) => {
            state.contact = action.payload;
        },

        // API response থেকে job সেট (ReviewJobScreen থেকে)
        postJob: (state, action) => {
            // action.payload = full job object from server
            const job = action.payload;
            state.job = job;
            state.jobStatus = job?.status || "posted";
            state.quotes = job?.quotes || [];
        },

        setWaitingForQuotes: (state) => {
            if (state.jobStatus === "posted") {
                state.jobStatus = "waiting_quotes";
            }
        },

        // Socket বা polling থেকে quotes আসলে
        receiveQuotes: (state, action) => {
            state.quotes = action.payload || [];
            state.jobStatus = "quotes_ready";
            if (state.job) {
                state.job.quotes = action.payload || [];
                state.job.status = "quotes_ready";
            }
        },

        selectQuote: (state, action) => {
            state.selectedQuoteId = action.payload;
        },

        // API response থেকে booking সেট
        confirmBooking: (state, action) => {
            const booking = action.payload;
            state.booking = booking;
            state.bookingStatus = booking?.status || "confirmed";
        },

        // Socket বা polling থেকে status আপডেট
        updateBookingStatus: (state, action) => {
            const status = action.payload;
            state.bookingStatus = status;
            if (state.booking) {
                state.booking.status = status;
            }
        },

        // Socket থেকে পুরো booking object আপডেট
        setBookingFromSocket: (state, action) => {
            const booking = action.payload;
            state.booking = booking;
            state.bookingStatus = booking?.status || state.bookingStatus;
        },

        submitReview: (state, action) => {
            state.review = action.payload;
        },

        resetGigJob: () => initialState,
    },
});

export const {
    startGigJob,
    answerQuestion,
    setContact,
    postJob,
    setWaitingForQuotes,
    receiveQuotes,
    selectQuote,
    confirmBooking,
    updateBookingStatus,
    setBookingFromSocket,
    submitReview,
    resetGigJob,
} = gigSlice.actions;

export default gigSlice.reducer;

// Selectors
export const selectGig = (state) => state.gig;
export const selectGigAnswers = (state) => state.gig.answers;
export const selectGigQuotes = (state) => state.gig.quotes;
export const selectSelectedQuote = (state) =>
    state.gig.quotes.find((q) => q.id === state.gig.selectedQuoteId) || null;
export const selectGigJobId = (state) => state.gig.job?.id;
export const selectGigBookingId = (state) => state.gig.booking?.id;
