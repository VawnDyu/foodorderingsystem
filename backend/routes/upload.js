// backend/routes/upload.js
const express = require('express');
const cloudinary = require('../Api/cloudinaryConfig');
const multer = require('multer');
const upload = multer(); // For handling file uploads

const router = express.Router();

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = await cloudinary.uploader.upload(file.buffer, {
      resource_type: 'auto', // Auto-detects the file type (image, video, etc.)
    });

    // Return the Cloudinary image URL
    res.json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading image' });
  }
});

module.exports = router;