const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Get orders with status Pending or Paid (excluding Completed orders)
router.get('/orders/pending-or-paid', async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [
        { orderStatus: 'Pending' },
        { paymentStatus: 'Paid' },
        { orderStatus: 'Cancelled' }
      ]
    })
    .populate('customerId', 'nickname') // populate nickname from customerId
    .sort({ createdAt: -1 }); // sort newest first

    res.json(orders); // return everything (no filtering in backend)
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;