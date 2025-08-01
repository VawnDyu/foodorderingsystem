const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User')
const bcrypt = require('bcryptjs');
const ActivityLog = require('../models/ActivityLog');

// PATCH /api/user/avatar
router.patch('/avatar', authMiddleware, async (req, res) => {
  const userId = req.user._id;
  const { imgSrc } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { imgSrc },
      { new: true }
    );

    await ActivityLog.create({
      message: 'You changed your avatar.',
      user: userId,
    });

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'Avatar updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/user/password
router.patch('/password', authMiddleware, async (req, res) => {
  const userId = req.user._id;
  const { currentPassword, newPassword } = req.body;

  // Validation for missing fields
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Password strength validation
  const isStrongPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(newPassword);
  if (!isStrongPassword) {
    return res.status(400).json({ message: 'New password must be at least 8 characters long, include letters & numbers.' });
  }

  try {
    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    // 🔐 Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    // 🔐 Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // ✅ Update the password in the user document
    user.password = hashedPassword;
    await user.save();

    await ActivityLog.create({
      message: 'You changed your password.',
      user: user,
    });

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// PATCH/api/user/nickname
router.patch('/nickname', authMiddleware, async (req, res) => {
  try {
    const { nickname, currentPassword } = req.body;

    // Validate nickname (you can add more validation as needed)
    if (!nickname || !currentPassword) {
      return res.status(400).json({ message: 'Please provide both current password and new nickname.' });
    }

    // Check if nickname is valid (letters, spaces, apostrophes, and hyphens only)
    const nicknameRegex = /^[A-Za-z\s'-]+$/;
    if (!nicknameRegex.test(nickname)) {
      return res.status(400).json({ message: 'Nickname can only contain letters, spaces, apostrophes, and hyphens.' });
    }

    // Find the logged-in user (ensure user is authenticated)
    const user = await User.findById(req.user._id); // req.user._id comes from authentication middleware
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if the current password matches the user's password
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Incorrect password.' });
    }

    // Update the nickname
    user.nickname = nickname;

    // Save the updated user data
    await user.save();

    await ActivityLog.create({
      message: 'You changed your nickname.',
      user: user,
    });

    // Return success response
    res.status(200).json({ message: 'Nickname updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
});

// PATCH /api/user/email
router.patch('/email', authMiddleware, async (req, res) => {
  const { newEmail, currentPassword } = req.body;
  const user = await User.findById(req.user._id);

  if (!user || !await bcrypt.compare(currentPassword, user.password)) {
    return res.status(401).json({ message: 'Invalid password.' });
  }

  user.email = newEmail;
  await user.save();

  // 🔒 Log the activity
  await ActivityLog.create({
    message: `You changed your email address.`,
    user: user,
  });

  res.json({ message: 'Email updated successfully.' });
});

// GET /api/user/:userId/activity-logs
router.get('/:userId/activity-logs', async (req, res) => {
  try {
    const { userId } = req.params;

    const logs = await ActivityLog.find({ user: userId }).sort({ date: -1 }); //Gets the recent logs first
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/user/users?search=term
router.get('/users', async (req, res) => {
  const search = req.query.search || '';

  try {
    const users = await User.find({
      nickname: { $regex: search, $options: 'i' }
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error while fetching users.' });
  }
});

// Add new user (register)
router.post('/register', authMiddleware, async (req, res) => {
  try {
    const { nickname, username, password, email, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      nickname,
      username,
      password: hashedPassword,
      email,
      role
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
});

// Delete user
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
});

module.exports = router;