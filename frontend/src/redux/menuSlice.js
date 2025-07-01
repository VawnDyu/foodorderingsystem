import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios';

const BASE_URL = `${import.meta.env.VITE_API_URL}/menu`;

// Fetch menu items
export const fetchMenu = createAsyncThunk('menu/fetchMenu', async (searchTerm = '') => {
  // const res = await axios.get(BASE_URL);
  const res = await axios.get(`/menu?search=${searchTerm}`);
  return res.data;
});

// Add new item
export const addMenuItem = createAsyncThunk('menu/addMenuItem', async (formData) => {
  const res = await axios.post(BASE_URL, formData);
  return res.data;
});

// Update item
export const updateMenuItem = createAsyncThunk('menu/updateMenuItem', async ({ id, formData }) => {
  const res = await axios.put(`${BASE_URL}/${id}`, formData);
  return res.data.item;
});

// Delete item
export const deleteMenuItem = createAsyncThunk('menu/deleteMenuItem', async (id) => {
  await axios.delete(`${BASE_URL}/${id}`);
  return id;
});

const menuSlice = createSlice({
  name: 'menu',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Keep existing ones
      .addCase(addMenuItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateMenuItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(i => i._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteMenuItem.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item._id !== action.payload);
      });
  },
});

export default menuSlice.reducer;
