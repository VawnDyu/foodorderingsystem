module.exports = (io, cashierSockets) => {
  const express = require('express');
  const router = express.Router();
  const authMiddleware = require('../middleware/authMiddleware');
  const Order = require('../models/Order');
  const MenuItem = require('../models/MenuItem');
  const mongoose = require('mongoose');

  // Place new order
  router.post('/order', authMiddleware, async (req, res) => {
    const { items } = req.body;

    console.log('Authenticated user:', req.user);

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item.' });
    }

    try {
      const userId = req.user._id;

      const populatedItems = [];
      let totalAmount = 0;

      for (let item of items) {
        const menuItem = await MenuItem.findById(item.itemId);
        if (!menuItem) {
          return res.status(400).json({ error: `Menu item ${item.itemId} not found.` });
        }

        populatedItems.push({
          itemId: item.itemId,
          name: menuItem.name,
          quantity: item.quantity,
          price: menuItem.price,
        });

        totalAmount += menuItem.price * item.quantity;
      }

      const newOrder = new Order({
        customerId: userId,
        items: populatedItems,
        totalPrice: totalAmount,
      });

      await newOrder.save();

      // ✅ Broadcast to cashiers
      for (const socketId of Object.values(cashierSockets)) {
        console.log('Emitting to socket:', socketId);
        io.to(socketId).emit('orderUpdate', newOrder);
      }

      res.status(201).json({ message: 'Order placed successfully!', order: newOrder });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // (Optional) Get all orders (without populate)
router.get('/order', async (req, res) => {
  try {
    // Fetch orders without populating item details
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get order for a specific user
router.get('/orders', async (req, res) => {
  try {
    const { customerId } = req.query;

    let orders;

    if (customerId) {
      const objectId = new mongoose.Types.ObjectId(customerId);
      orders = await Order.find({ customerId: objectId }).sort ({ createdAt: -1 });
    } else {
      orders = await Order.find().sort({ createdAt: -1 });
    }

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Gets the number of orders and total sales for today, week, month, or year
router.get('/orders/count/:range', async (req, res) => {
  const { range = 'today' } = req.params; // fixed: use req.params, not query
  const now = new Date();
  let startDate, endDate = new Date();

  switch (range) {
    case 'today':
      startDate = new Date(now.setHours(0, 0, 0, 0));
      break;
    case 'week':
      const day = now.getDay(); // 0 (Sun) to 6 (Sat)
      const diff = (day === 0 ? 6 : day - 1); // If Sunday, go back 6 days; otherwise, back to Monday
      startDate = new Date(now);
      startDate.setDate(now.getDate() - diff);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      return res.status(400).json({ error: 'Invalid range type' });
  }

  // console.log('Start Date:', startDate.toLocaleString('en-PH', {
  //   weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  //   hour: '2-digit', minute: '2-digit'
  // }));
  // console.log('End Date:', endDate.toLocaleString('en-PH', {
  //   weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  //   hour: '2-digit', minute: '2-digit'
  // }));

  try {
    // ✅ Fetch the orders
    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate },
      orderStatus: 'Completed',
      paymentStatus: 'Paid',
    })
    .select('customerId nickname items orderStatus totalPrice')
    .populate('customerId', 'nickname')
    .sort({ createdAt: -1 });

    const itemFrequency = {};

    // Count all items
    orders.forEach(order => {
      order.items.forEach(item => {
        const name = item.name;
        const qty = item.quantity || 1;

        if (itemFrequency[name]) {
          itemFrequency[name] += qty;
        } else {
          itemFrequency[name] = qty;
        }
      });
    });

    // const sortedItems = Object.entries(itemFrequency)
    //   .sort((a, b) => b[1] - a[1]);

    // console.log('Sorted Item Frequency:', sortedItems);

    // Find the top dish
    let topDish = '';
    let maxCount = 0;
    let topDishEmoji = '';

    for (const [dish, count] of Object.entries(itemFrequency)) {
      if (count > maxCount) {
        maxCount = count;
        topDish = dish;
      }
    }

    if (topDish) {
      const menuItem = await MenuItem.findOne({ name: topDish });
      if (menuItem && menuItem.emoji) {
        topDishEmoji = menuItem.emoji;
      }
    }

    // console.log('Top Dish:', topDish, 'with', maxCount, 'orders');

    // ✅ Calculate total sales from the fetched orders
    const totalSales = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

    res.json({
      count: orders.length,
      totalSales,
      topDish,
      topDishEmoji,
      completedOrders: orders,
    });
  } catch (err) {
    console.error('Error in /orders/count/:range:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// Get orders by id for receipt
router.get('/orders/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const orders = await Order.findById(id);
    if (!orders) {
      return res.status(404).send('Order not found');
    }
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// GET /api/order/:id
router.get('/order/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const menuItem = await MenuItem.findById(id);
    if (!menuItem) {
      return res.status(404).send('Menu item not found');
    }
    res.json(menuItem);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Backend route to get all orders for a customer
router.get('/customer/orders/:customerId', async (req, res) => {
  const { customerId } = req.params; // Get customerId from request params

  try {
    const orders = await Order.find({ customerId })
    .sort({ createdAt: -1 });
    res.json(orders); // Return all orders for the customer (including completed)
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

  return router;
};

