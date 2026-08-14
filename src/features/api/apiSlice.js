import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// const BASE_URL = 'http://10.0.2.2:3000'; // Android emulator
const BASE_URL = "http://192.168.0.101:3000"; // Android emulator PC
// const BASE_URL = 'http://192.168.x.x:3000'; // real device

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: async (headers) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

const baseQueryWithAuth = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    await AsyncStorage.multiRemove(["token", "user"]);
    // optional: api.dispatch(userLoggedOut());
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["User", "Driver", "Ride", "ActiveRide", "PaymentMethods"],
  endpoints: () => ({}), // empty – features will inject
});
