const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    message: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false // Optional depending on if logs must be tied to a user
    },
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);