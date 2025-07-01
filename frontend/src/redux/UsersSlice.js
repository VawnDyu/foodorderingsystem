import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios';

// Fetch all users (with optional search)
export const fetchUsers = createAsyncThunk('users/fetchUsers', async (searchTerm = '') => {
  const res = await axios.get(`/user/users?search=${searchTerm}`);
  return res.data;
});

// Add a new user
export const addUser = createAsyncThunk('users/addUser', async (newUser) => {
  const res = await axios.post('/user/register', newUser, {
    withCredentials: true
  });
  return res.data;
});

// Delete a user by ID
export const deleteUser = createAsyncThunk('users/deleteUser', async (userId) => {
  await axios.delete(`/user/${userId}`, {
    withCredentials: true
  });
  return userId;
});


const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD
      .addCase(addUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // DELETE
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(user => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default usersSlice.reducer;
