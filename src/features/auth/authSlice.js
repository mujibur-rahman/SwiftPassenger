import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiSlice } from '@/features/api/apiSlice';

const initialState = {
  accessToken: null,
  user: null,
};

// ========== Logout Thunk ==========
export const logout = createAsyncThunk("auth/logout", async (_, { dispatch }) => {
  // 1. Clear storage
  await AsyncStorage.multiRemove(["token", "user"]);

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
    builder.addCase(logout.fulfilled, (state) => {
      state.accessToken = null;
      state.user = null;
    });
  },
});

export const { userLoggedIn, userLoggedOut } = authSlice.actions;
export default authSlice.reducer;