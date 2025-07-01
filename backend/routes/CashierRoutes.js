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
    console.error('❌ Error fetching orders:', err);
    res.status(500).json({ error: 'Server error' });
  }
});



// Mark as paid
// router.patch('/orders/:id/mark-as-paid', async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);
//     if (!order) return res.status(404).json({ message: 'Order not found' });

//     order.paymentStatus = 'Paid';
//     await order.save();

//     res.json(order);
//   } catch (err) {
//     res.status(500).json({ message: 'Error updating order', error: err.message });
//   }
// });

module.exports = router;