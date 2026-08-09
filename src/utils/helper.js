// src/utils/helpers.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { userLoggedOut } from "../store/auth/authSlice";
import { apiSlice } from "../store/api/apiSlice";

export const getName = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0][0].toUpperCase();

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

// ========== Logout helper ==========
export const logout = () => async (dispatch) => {
  try {
    // 1. Clear AsyncStorage
    await AsyncStorage.multiRemove(["token", "user"]);

    // 2. Clear auth state
    dispatch(userLoggedOut());

    // 3. Clear RTK Query cache
    dispatch(apiSlice.util.resetApiState());
  } catch (error) {
    console.log("Logout error:", error);
  }
};