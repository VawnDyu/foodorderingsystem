const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem'); // adjust path
require('dotenv').config({ path: __dirname + '/../.env' });

const emojiMap = {
  'Burger': '🍔',
  'Bulalo': '🥩', // no exact emoji, beef stew approximation
  'Jelly Sandwich': '🥪',
  'Vegetable Salad': '🥗',
  'Bottled Water': '💧',
  'Orange Juice': '🍊',
  'Sinigang': '🥣', // general soup
  'Tinola': '🍲',   // general stew/soup
  'Kare-Kare': '🍛', // closest to peanut-based stew
  'Ginisang Munggo': '🌱', // mung bean approximation
};

async function updateEmojis() {
  await mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

  for (const [name, emoji] of Object.entries(emojiMap)) {
    const result = await MenuItem.updateMany(
      { name },                   // filter by name
      { $set: { emoji } }         // set emoji field
    );
    console.log(`Updated ${result.modifiedCount} item(s) for "${name}"`);
  }

  mongoose.disconnect();
}

updateEmojis().catch(console.error);