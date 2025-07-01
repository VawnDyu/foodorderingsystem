const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema ({
    nickname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['Customer', 'Admin', 'Cashier', 'Chef'],
        default: 'Customer'
    },
    imgSrc: {
        type: String,
        default: 'avatar1.png', // Optional: default to empty string or placeholder image
    },
    createdAt: {
        type: Date,
    }
});

module.exports = mongoose.model('User', UserSchema);