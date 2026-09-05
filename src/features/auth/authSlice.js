import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "@/features/api/apiSlice";

const initialState = {
  accessToken: null,
  user: null,
  isHydrated: false,
};

export const hydrateAuth = createAsyncThunk("auth/hydrate", async () => {
  const [[, token], [, userStr]] = await AsyncStorage.multiGet(["token", "user"]);
  let user = null;
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch (_) { }
  }
  return { accessToken: token || null, user };
});

export const logout = createAsyncThunk("auth/logout", async (_, { dispatch }) => {
  // 1. Clear storage
  await AsyncStorage.multiRemove(["token", "user", "refreshToken"]);

  // 2. Clear RTK Query cache
  dispatch(apiSlice.util.resetApiState());
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userLoggedIn: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
    },
    userLoggedOut: (state) => {
      state.accessToken = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hydrateAuth.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
        state.isHydrated = true;
      })
      .addCase(hydrateAuth.rejected, (state) => {
        state.isHydrated = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.accessToken = null;
        state.user = null;
      });
  },
});

export const { userLoggedIn, userLoggedOut } = authSlice.actions;
export default authSlice.reducer;

export const selectIsAuthenticated = (s) => !!s.auth.accessToken;
export const selectUser = (s) => s.auth.user;
export const selectAuthHydrated = (s) => s.auth.isHydrated;
