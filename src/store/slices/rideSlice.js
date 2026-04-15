// passenger-app/src/store/slices/rideSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const requestRide = createAsyncThunk('ride/request', async (rideData, { rejectWithValue }) => {
  try {
    const res = await api.post('/rides/request', rideData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Ride request failed');
  }
});

export const cancelRide = createAsyncThunk('ride/cancel', async (rideId, { rejectWithValue }) => {
  try {
    await api.post(`/rides/${rideId}/cancel`);
    return rideId;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Cancel failed');
  }
});

export const getRideHistory = createAsyncThunk('ride/history', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/rides/history');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch history');
  }
});

export const getFareEstimate = createAsyncThunk('ride/fareEstimate', async ({ origin, destination }, { rejectWithValue }) => {
  try {
    const res = await api.post('/rides/estimate', { origin, destination });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Estimate failed');
  }
});

const rideSlice = createSlice({
  name: 'ride',
  initialState: {
    currentRide: null,
    rideStatus: 'idle', // idle | searching | accepted | pickup | ongoing | completed | cancelled
    fareEstimate: null,
    driverLocation: null,
    driver: null,
    history: [],
    loading: false,
    error: null,
    eta: null,
    rating: null,
  },
  reducers: {
    updateRideStatus: (state, action) => {
      state.rideStatus = action.payload;
    },
    updateDriverLocation: (state, action) => {
      state.driverLocation = action.payload;
    },
    setCurrentRide: (state, action) => {
      state.currentRide = action.payload;
    },
    setDriver: (state, action) => {
      state.driver = action.payload;
    },
    updateETA: (state, action) => {
      state.eta = action.payload;
    },
    setRating: (state, action) => {
      state.rating = action.payload;
    },
    resetRide: (state) => {
      state.currentRide = null;
      state.rideStatus = 'idle';
      state.driver = null;
      state.driverLocation = null;
      state.eta = null;
      state.fareEstimate = null;
      state.rating = null;
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestRide.pending, (state) => { state.loading = true; state.rideStatus = 'searching'; })
      .addCase(requestRide.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRide = action.payload.ride;
        state.rideStatus = 'searching';
      })
      .addCase(requestRide.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.rideStatus = 'idle';
      })
      .addCase(cancelRide.fulfilled, (state) => {
        state.rideStatus = 'cancelled';
        state.currentRide = null;
        state.driver = null;
      })
      .addCase(getFareEstimate.fulfilled, (state, action) => {
        state.fareEstimate = action.payload;
      })
      .addCase(getRideHistory.fulfilled, (state, action) => {
        state.history = action.payload.rides;
      });
  },
});

export const {
  updateRideStatus, updateDriverLocation, setCurrentRide,
  setDriver, updateETA, setRating, resetRide, clearError,
} = rideSlice.actions;
export default rideSlice.reducer;
