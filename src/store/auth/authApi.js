import { apiSlice } from "../api/apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ phone, password }) => ({
        url: "/login",
        method: "POST",
        body: { phone, password },
      }),
    }),

    register: builder.mutation({
      query: (body) => ({
        url: "/auth/passenger/register",
        method: "POST",
        body,
      }),
    }),

    sendOtp: builder.mutation({
      query: ({ phone }) => ({
        url: "/auth/otp/send",
        method: "POST",
        body: { phone },
      }),
    }),

    verifyOtp: builder.mutation({
      query: ({ phone, otp }) => ({
        url: "/auth/otp/verify",
        method: "POST",
        body: { phone, otp },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
} = authApi;
