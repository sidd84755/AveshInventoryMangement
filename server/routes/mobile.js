const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const mobileSchema = require('../models/Mobile');

module.exports = (connection) => {
  // Initialize Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  // Configure Cloudinary storage
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'mobile-products',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      public_id: (req, file) => `mobile-${Date.now()}-${file.originalname}`,
    },
  });

  const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
  });

  // Create model using secondary connection
  const Mobile = connection.model('Mobile', mobileSchema);

  // Get all mobile entries
  router.get('/', async (req, res) => {
    try {
      const mobiles = await Mobile.find().populate('productId', 'name description');
      res.json(mobiles);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Create new mobile entry
  router.post('/', upload.single('image'), async (req, res) => {
    try {
      const { productId, category, price, stock } = req.body;
      
      if (!productId || !category || !req.file) {
        return res.status(400).json({ 
          message: 'Missing required fields: productId, category, or image' 
        });
      }

      const newMobile = new Mobile({
        productId,
        category,
        image: req.file.path,
        price: Number(price),
        stock: Number(stock)
      });

      const savedMobile = await newMobile.save();
      res.status(201).json(savedMobile);

    } catch (err) {
      console.error('Error creating mobile entry:', err);
      res.status(400).json({ 
        message: err.message || 'Error creating mobile entry' 
      });
    }
  });

  return router;
};