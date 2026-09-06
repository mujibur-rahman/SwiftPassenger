import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentOrder: null,
  orderStatus: "idle", // idle | confirmed | preparing | on_the_way | delivered
  rider: null,
};

const foodOrderSlice = createSlice({
  name: "foodOrder",
  initialState,
  reducers: {
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    updateOrderStatus: (state, action) => {
      state.orderStatus = action.payload;
    },
    setRider: (state, action) => {
      state.rider = action.payload;
    },
    resetOrder: (state) => {
      state.currentOrder = null;
      state.orderStatus = "idle";
      state.rider = null;
    },
  },
});

export const { setCurrentOrder, updateOrderStatus, setRider, resetOrder } =
  foodOrderSlice.actions;

export default foodOrderSlice.reducer;
