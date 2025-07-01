const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, //Ensures that the name is unique in the database
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
    enum: ['drinks', 'meals', 'desserts'], // restrict to specific values
    required: true,
  },
});

module.exports = mongoose.model('MenuItem', MenuItemSchema);
