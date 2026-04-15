// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

export const loginUser = createAsyncThunk('auth/login', async ({ phone, password }, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/passenger/login', { phone, password });
    await AsyncStorage.setItem('token', res.data.token);
    await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.detail || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/passenger/register', data);
    await AsyncStorage.setItem('token', res.data.token);
    await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.detail || 'Registration failed');
  }
});

export const loadUser = createAsyncThunk('auth/loadUser', async (_, { rejectWithValue }) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const user  = await AsyncStorage.getItem('user');
    if (!token || !user) throw new Error('No session');
    return { token, user: JSON.parse(user) };
  } catch (err) {
    return rejectWithValue('No session');
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('user');
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
    isAuthenticated: false,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
    // Update local user profile after a successful PATCH
    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        // Persist updated user to AsyncStorage
        AsyncStorage.setItem('user', JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending,    (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled,  (state, action) => {
        state.loading = false;
        state.user    = action.payload.user;
        state.token   = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected,   (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user    = action.payload.user;
        state.token   = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(loadUser.fulfilled,  (state, action) => {
        state.user    = action.payload.user;
        state.token   = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loadUser.rejected,   (state) => { state.isAuthenticated = false; })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user    = null;
        state.token   = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;
