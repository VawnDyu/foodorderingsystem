// orderSlice.js
import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    latestUpdate: null, // { id, status }
  },
  reducers: {
    setLatestOrderUpdate(state, action) {
      state.latestUpdate = action.payload;
    },
    clearLatestOrderUpdate(state) {
      state.latestUpdate = null;
    },
  },
});

export const { setLatestOrderUpdate, clearLatestOrderUpdate } = orderSlice.actions;
export default orderSlice.reducer;
