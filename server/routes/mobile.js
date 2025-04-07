const express = require('express');
const mongoose = require('mongoose');
const mobileSchema = require('../models/Mobile');

module.exports = (secondaryConn) => {
  const router = express.Router();
  const Mobile = secondaryConn.model('Mobile', mobileSchema);
  const Product = mongoose.model('Product'); // primary connection

  router.get('/', async (req, res) => {
    try {
      const mobiles = await Mobile.find();
      // manually fetch products
      const populated = await Promise.all(mobiles.map(async m => {
        const product = await Product.findById(m.productId, 'name description');
        return {
          ...m.toObject(),
          product,
        };
      }));
      res.json(populated);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Create new mobile entry
  router.post('/', async (req, res) => {
    try {
      const { productId, category, price, stock, image } = req.body;

      if (!productId || !category || !image) {
        return res.status(400).json({ message: 'Missing required fields: productId, category, or image URL' });
      }

      const newMobile = new Mobile({
        productId,
        category,
        image,       // URL string from frontend
        price: Number(price),
        stock: Number(stock),
      });

      const savedMobile = await newMobile.save();
      res.status(201).json(savedMobile);
    } catch (err) {
      console.error('Error creating mobile entry:', err);
      res.status(400).json({ message: err.message || 'Error creating mobile entry' });
    }
  });

  return router;
};
