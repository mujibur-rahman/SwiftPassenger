import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    serviceId: null,
    answers: {}, // { [questionId]: optionId }
    contact: null, // { fullName, mobile, email, address, suburb, postcode, notes, photos }

    job: null, // posted job snapshot: { serviceId, answers, contact, postedAt }
    jobStatus: "idle", // idle | posted | waiting_quotes | quotes_ready

    quotes: [], // [{ id, providerName, providerPhoto, rating, reviews, price, availability, distance, message }]
    selectedQuoteId: null,

    booking: null, // { quoteId, provider, price, scheduledAt, location, ... }
    bookingStatus: "idle", // idle | confirmed | on_the_way | arrived | started | completed

    review: null, // { rating, text, tags }
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

        // জব পোস্ট — বর্তমান serviceId/answers/contact থেকে স্ন্যাপশট তৈরি করে
        postJob: (state) => {
            state.job = {
                serviceId: state.serviceId,
                answers: state.answers,
                contact: state.contact,
                postedAt: new Date().toISOString(),
            };
            state.jobStatus = "posted";
            state.quotes = [];
        },

        // কোট পাওয়ার অপেক্ষায় থাকলে সেট করা হয় (WaitingForQuotesScreen থেকে)
        setWaitingForQuotes: (state) => {
            if (state.jobStatus === "posted") {
                state.jobStatus = "waiting_quotes";
            }
        },

        receiveQuotes: (state, action) => {
            state.quotes = action.payload;
            state.jobStatus = "quotes_ready";
        },

        selectQuote: (state, action) => {
            state.selectedQuoteId = action.payload;
        },

        confirmBooking: (state, action) => {
            state.booking = action.payload;
            state.bookingStatus = "confirmed";
        },

        updateBookingStatus: (state, action) => {
            state.bookingStatus = action.payload;
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
