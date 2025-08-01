const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  emoji: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: true,
  },
  imgUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['drinks', 'meals', 'desserts'],
    required: true,
  },
});

module.exports = mongoose.model('MenuItem', MenuItemSchema);
