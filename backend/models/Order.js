const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true,
      },
      name: String,
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
      },
    }
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  orderStatus: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Preparing', 'Cancelled', 'Completed'],
  },
  paymentStatus: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Completed', 'Cancelled'],
  },
}, { timestamps: true });

orderSchema.pre('save', async function(next) {
  for (let i = 0; i < this.items.length; i++) {
    const menuItem = await mongoose.model('MenuItem').findById(this.items[i].itemId);
    if (menuItem) {
      this.items[i].name = menuItem.name;
      this.items[i].price = menuItem.price;
    }
  }

  // Calculate total price
  this.totalPrice = this.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);

  next();
});

module.exports = mongoose.model('Order', orderSchema);
