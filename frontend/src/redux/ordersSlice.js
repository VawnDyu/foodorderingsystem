// src/features/orders/ordersSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios';

// Fetch orders with status "Pending" or payment "Paid"
export const fetchPendingOrPaidOrders = createAsyncThunk(
  'orders/fetchPendingOrPaidOrders',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Sending request to fetch orders...');
      const res = await axios.get('/cashier/orders/pending-or-paid', {
        withCredentials: true
      });
      console.log('Received response:', res);
      return res.data;
    } catch (err) {
      console.error('Error fetching orders:', err);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Fetch orders with status "Paid" or "Preparing"
export const fetchPaidOrPreparingOrders = createAsyncThunk(
  'orders/fetchPaidOrPreparingOrders',
  async (_, { rejectWithValue}) => {
    try {
      console.log('Sending request to fetch orders...');
      const res = await axios.get('/chef/orders/paid-or-preparing', {
        withCredentials: true
      });
      console.log('Recieved response:', res);
      return res.data;
    } catch (err) {
      console.error('Error fetching orders:', err);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

//Fetch all of the customer orders in customers dashboard
export const fetchAllCustomerOrders = createAsyncThunk(
  'orders/fetchAllCustomerOrders',
  async (customerId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/customer/orders/${customerId}`, {
        withCredentials: true,
      });
      return res.data; // All customer orders (including completed ones)
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Fetch the orders count
export const fetchOrderCount = createAsyncThunk(
  'dashboard/fetchOrderCount',
  async (range) => {
    const res = await axios.get(`/orders/count/${range}`);
    return { range, data: res.data };
  }
);

export const markOrderAsPreparing = createAsyncThunk('orders/markAsPreparing', async (orderId) => {
  const res = await axios.patch(`/cashier/socket-orders/${orderId}/mark-as-preparing`, {}, { withCredentials: true });
  return res.data; //The response should be the updated order
})

export const markOrderAsCompleted = createAsyncThunk('orders/markAsCompleted', async (orderId) => {
  const res = await axios.patch(`/cashier/socket-orders/${orderId}/mark-as-completed`, {}, { withCredentials: true });
  return res.data; //The response should be the updated order
})

export const markOrderAsPaid = createAsyncThunk('orders/markAsPaid', async (orderId) => {
  const res = await axios.patch(`/cashier/socket-orders/${orderId}/mark-as-paid`, {}, { withCredentials: true });
  return res.data; // The response should be the updated order
});

export const cancelOrder = createAsyncThunk('orders/cancelOrder', async (orderId) => {
  const res = await axios.patch(
    `/cashier/socket-orders/${orderId}/cancel`, // <--- your cancel endpoint
    {},
    { withCredentials: true }
  );
  return res.data; // Should return the updated order
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    loading: false,
    error: null,
    orderCounts: {},
    completedOrders: {},
  },
  reducers: {
    updateOrderInList: (state, action) => {
      const updatedOrder = action.payload;

      // Create a new array with updated order replacing the old one
      const updatedOrders = state.orders
        .filter(order => order._id !== updatedOrder._id) // remove old one
        .concat(updatedOrder); // add updated order

      // Sort by newest first
      state.orders = updatedOrders.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    },
  },
  extraReducers: (builder) => {
    builder
      //Checks if the orders are Pending or Paid
      .addCase(fetchPendingOrPaidOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingOrPaidOrders.fulfilled, (state, action) => {
        console.log('✅ Fulfilled action:', action); // <-- See what's inside
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchPendingOrPaidOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //Checks if the orders are Paid or Preparing
      .addCase(fetchPaidOrPreparingOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaidOrPreparingOrders.fulfilled, (state, action) => {
        console.log('✅ Fulfilled action:', action); // <-- See what's inside
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchPaidOrPreparingOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //Mark orders as Paid
      .addCase(markOrderAsPaid.fulfilled, (state, action) => {
      const updatedOrder = action.payload;
      state.orders = state.orders.map((order) =>
        order._id === updatedOrder._id ? updatedOrder : order
        );
      })

      //Mark orders as Preparing
      .addCase(markOrderAsPreparing.fulfilled, (state, action) => {
      const updatedOrder = action.payload;
      state.orders = state.orders.map((order) =>
        order._id === updatedOrder._id ? updatedOrder : order
        );
      })

      //Mark orders as Completed
      .addCase(markOrderAsCompleted.fulfilled, (state, action) => {
      const updatedOrder = action.payload;
      state.orders = state.orders.map((order) =>
        order._id === updatedOrder._id ? updatedOrder : order
        );
      })

      //Fetch All Customer Orders
      .addCase(fetchAllCustomerOrders.pending, (state) => {
      state.loading = true;
      state.error = null;
      })
      .addCase(fetchAllCustomerOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllCustomerOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //Cancel the order
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        state.orders = state.orders.map(order =>
          order._id === updatedOrder._id ? updatedOrder : order
        );
      })

      //Fetch orders count with total sales
      .addCase(fetchOrderCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderCount.fulfilled, (state, action) => {
        const { range, data } = action.payload;
        state.orderCounts[range] = {
          count: data.count,
          totalSales: data.totalSales,
          topDish: data.topDish,
          topDishEmoji: data.topDishEmoji,
        };
        state.completedOrders[range] = data.completedOrders;
        state.loading = false;
      })
      .addCase(fetchOrderCount.rejected, (state) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export const { updateOrderInList } = ordersSlice.actions;
export default ordersSlice.reducer;
