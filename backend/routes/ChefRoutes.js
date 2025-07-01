const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Get orders with status Paid or Preparing (excluding Completed orders)
router.get('/orders/paid-or-preparing', async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [
        { orderStatus: 'Paid' },
        { paymentStatus: 'Paid' },
        { orderStatus: 'Cancelled' }
      ]
    })
    .populate('customerId', 'nickname')
    .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;