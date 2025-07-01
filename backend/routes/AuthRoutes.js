const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const Cookies = require('cookie');

// Only admins can hit this
router.post('/admin/create', async (req, res) => {
    const newAdmin = new User({
      ...req.body,
      role: 'Admin'
    });
    await newAdmin.save();
    res.json({ message: 'Admin created' });
});

//Signup Route
router.post('/signup', async (req, res) => {
    const { nickname, email, username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username: new RegExp('^' + username + '$', 'i') });
        const existingEmail = await User.findOne({email});
        
        if (existingUser) return res.status(400).json({
            error: 'Username is already taken'
        });

        if (existingEmail) return res.status(400).json({
            error: 'Email is already taken'
        })

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ nickname, email, username, password: hashedPassword , role: "Customer"});
        await newUser.save();

        // ✅ This is important!
        res.status(201).json({ message: 'User created successfully' });

    } catch (err) {
        res.status(500).json({
            error: 'Something went wrong'
        });
    }
});

// Create tokens
const generateAccessToken = (userId) => {
    return jwt.sign({ _id: userId }, process.env.JWT_SECRET, { expiresIn: '15m' }); // short-lived
};
  
const generateRefreshToken = (userId) => {
    return jwt.sign({ _id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' }); // long-lived
}

// Login Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Save the accessToken and refreshToken in cookies (use res.cookie())
        res.cookie('accessToken', accessToken, {
            httpOnly: true,         // Prevents JS access (XSS protection)
            secure: process.env.NODE_ENV === 'production',  // Ensures cookie is sent over HTTPS only in production
            sameSite: 'Strict',     // Prevents CSRF
            maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,         // Prevents JS access (XSS protection)
            secure: process.env.NODE_ENV === 'production',  // Ensures cookie is sent over HTTPS only in production
            sameSite: 'Strict',     // Prevents CSRF
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        });

        // Respond with accessToken, refreshToken, and user data
        res.json({
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                nickname: user.nickname,
                username: user.username,
                role: user.role,
                imgSrc: user.imgSrc,
            },
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Something went wrong',
        });
    }
});

//Logout Route to remove cookies
router.post('/logout', (req, res) => {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
    });
  
    res.status(200).json({ message: 'Logged out successfully' });
});


//Refresh token route  
router.post('/refresh-token', async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ error: 'Refresh token required' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload._id).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newAccessToken = generateAccessToken(payload._id);

    
    // Set the new access token in the cookies
    res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: true, // If you're using https
        sameSite: 'Strict',
        maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.json({
      accessToken: newAccessToken,
      user,
    });
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired refresh token' });
  }
});

//Logout Route
router.post('/logout', (req, res) => {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      path: '/', // Make sure this matches how it was set
    });
  
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      path: '/',
    });
  
    res.status(200).json({ message: 'Logged out successfully' });
});  

module.exports = router;