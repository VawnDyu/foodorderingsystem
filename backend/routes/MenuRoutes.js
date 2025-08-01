const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
// Get all menu items
router.get('/menu', async (req, res) => {
  const search = req.query.search || '';
  const regex = new RegExp(search, 'i'); // case-insensitive search

  try {
    const items = await MenuItem.find({
      name: { $regex: regex },
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error while fetching menu items.' });
  }
});

// Add new menu item
router.post('/menu', async (req, res) => {
  const { name, price, imgUrl, category, description } = req.body;
  try {
    const newItem = new MenuItem({ name, price, imgUrl, category, description });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    if (err.code === 11000) {  // Duplicate key error code
      return res.status(400).json({ error: 'Menu item already exists!' });
    }
    res.status(400).json({ error: err.message });
  }
});

//Delete Menu

router.delete('/menu/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const deletedItem = await MenuItem.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error during deletion' });
  }
});

// Update Menu
router.put('/menu/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, imgUrl, category, description } = req.body;

  try {
    // Find and update the menu item
    const updatedItem = await MenuItem.findByIdAndUpdate(
      id,
      { name, price, imgUrl, category, description },
      { new: true } // Return the updated document
    );

    if (!updatedItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json({ message: 'Menu item updated successfully', item: updatedItem });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
