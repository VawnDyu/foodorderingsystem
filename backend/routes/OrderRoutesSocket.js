// OrderRoutesSocket.js
const express = require('express');
const Order = require('../models/Order');

module.exports = (io, customerSockets) => {
  const router = express.Router();

  // Update order status
  router.patch('/:orderId/mark-as-paid', async (req, res) => {
  const { orderId } = req.params;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        orderStatus: 'Paid',
        paymentStatus: 'Paid'
      },
      { new: true }
    ).populate('customerId', 'nickname');

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const customerIdStr = updatedOrder.customerId?.toString();

    if (!customerIdStr) {
      console.error('❌ Missing customerId in updated order');
      return res.status(500).json({ message: 'Invalid customer ID' });
    }

    const customerSocketId = customerSockets[customerIdStr];

    console.log('Customer Socket ID:', customerSocketId);

    if (customerSocketId) {
      io.to(customerSocketId).emit('orderUpdate', updatedOrder);
      console.log(`Emitting orderUpdate to socket ${customerSocketId}`);
    } else {
      console.log(`No active socket for customer ${customerIdStr}`);
    }

    // ✅ Notify all connected cashiers
    io.emit('orderUpdate', updatedOrder); // Broadcasts to all

    return res.status(200).json(updatedOrder);
  } catch (err) {
    console.error('Error updating order:', err);
    return res.status(500).json({ message: 'Failed to update order status' });
  }
});

  // Update order status preparing
  router.patch('/:orderId/mark-as-preparing', async (req, res) => {
  const { orderId } = req.params;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        orderStatus: 'Preparing',
      },
      { new: true }
    ).populate('customerId', 'nickname');

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const customerIdStr = updatedOrder.customerId?.toString();

    if (!customerIdStr) {
      console.error('❌ Missing customerId in updated order');
      return res.status(500).json({ message: 'Invalid customer ID' });
    }

    const customerSocketId = customerSockets[customerIdStr];

    console.log('Customer Socket ID:', customerSocketId);

    if (customerSocketId) {
      io.to(customerSocketId).emit('orderUpdate', updatedOrder);
      console.log(`Emitting orderUpdate to socket ${customerSocketId}`);
    } else {
      console.log(`No active socket for customer ${customerIdStr}`);
    }

    // ✅ Notify all connected cashiers
    io.emit('orderUpdate', updatedOrder); // Broadcasts to all

    return res.status(200).json(updatedOrder);
  } catch (err) {
    console.error('Error updating order:', err);
    return res.status(500).json({ message: 'Failed to update order status' });
  }
});

  // Update order status preparing
  router.patch('/:orderId/mark-as-completed', async (req, res) => {
  const { orderId } = req.params;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        orderStatus: 'Completed',
      },
      { new: true }
    ).populate('customerId', 'nickname');

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const customerIdStr = updatedOrder.customerId?.toString();

    if (!customerIdStr) {
      console.error('❌ Missing customerId in updated order');
      return res.status(500).json({ message: 'Invalid customer ID' });
    }

    const customerSocketId = customerSockets[customerIdStr];

    console.log('Customer Socket ID:', customerSocketId);

    if (customerSocketId) {
      io.to(customerSocketId).emit('orderUpdate', updatedOrder);
      console.log(`Emitting orderUpdate to socket ${customerSocketId}`);
    } else {
      console.log(`No active socket for customer ${customerIdStr}`);
    }

    // ✅ Notify all connected cashiers
    io.emit('orderUpdate', updatedOrder); // Broadcasts to all

    return res.status(200).json(updatedOrder);
  } catch (err) {
    console.error('Error updating order:', err);
    return res.status(500).json({ message: 'Failed to update order status' });
  }
});

// PATCH /cashier/socket-orders/:id/cancel
router.patch('/:orderId/cancel', async (req, res) => {
  try {
    const { orderId } = req.params;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        orderStatus: 'Cancelled',
        paymentStatus: 'Cancelled',
      },
      { new: true } // return the updated document
    ).populate('customerId', 'nickname');

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const customerIdStr = updatedOrder.customerId?.toString();

    if (!customerIdStr) {
      console.error('❌ Missing customerId in updated order');
      return res.status(500).json({ message: 'Invalid customer ID' });
    }

    const customerSocketId = customerSockets[customerIdStr];

    console.log('Customer Socket ID:', customerSocketId);

    if (customerSocketId) {
      io.to(customerSocketId).emit('orderUpdate', updatedOrder);
      console.log(`Emitting orderUpdate to socket ${customerSocketId}`);
    } else {
      console.log(`No active socket for customer ${customerIdStr}`);
    }

    // ✅ Notify all connected cashiers
    io.emit('orderUpdate', updatedOrder); // Broadcasts to all

    return res.status(200).json(updatedOrder);
  } catch (err) {
    console.error('Error updating order:', err);
    return res.status(500).json({ message: 'Failed to update order status' });
  }
});

  return router;
};
