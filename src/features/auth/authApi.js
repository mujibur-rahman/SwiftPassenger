import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiSlice } from '@/features/api/apiSlice';
import { userLoggedIn } from '@/features/auth/authSlice';

const saveAuthData = async (data, dispatch) => {
  const accessToken = data.accessToken || data.token;
  const refreshToken = data.refreshToken;

  await AsyncStorage.setItem("token", accessToken);
  if (refreshToken) {
    await AsyncStorage.setItem("refreshToken", refreshToken);
  }
  await AsyncStorage.setItem("user", JSON.stringify(data.user));

  dispatch(
    userLoggedIn({
      accessToken,
      user: data.user,
    }),
  );
};

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ phone, password }) => ({
        url: "/login",
        method: "POST",
        body: { phone, password }, // server maps phone → email
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          const token = data.accessToken || data.token;

          await AsyncStorage.setItem("token", token);
          await AsyncStorage.setItem("user", JSON.stringify(data.user));

          // console.log('login token', token)
          // console.log('login user', data.user)

          dispatch(
            userLoggedIn({
              accessToken: token,
              user: data.user,
            }),
          );
        } catch (err) { }
      },
    }),

    register: builder.mutation({
      query: (body) => ({
        url: "/register", // json-server-auth endpoint ← must match server
        method: "POST",
        body: {
          name: body.name,
          phone: body.phone,
          email: body.email || body.phone,
          password: body.password,
        },
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          const token = data.accessToken || data.token;

          await AsyncStorage.setItem("token", token);
          await AsyncStorage.setItem("user", JSON.stringify(data.user));

          dispatch(
            userLoggedIn({
              accessToken: token,
              user: data.user,
            }),
          );
        } catch (err) { }
      },
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
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          await saveAuthData(data, dispatch);
        } catch (err) { }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
} = authApi;
