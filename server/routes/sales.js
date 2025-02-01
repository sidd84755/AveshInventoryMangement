const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Product = require('../models/Product');

// Record sale
router.post('/', async (req, res) => {
  try {
    const product = await Product.findById(req.body.productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.stock < req.body.quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    product.stock -= req.body.quantity;
    await product.save();

    const sale = new Sale({
      product: req.body.productId,
      quantity: req.body.quantity
    });

    const newSale = await sale.save();
    res.status(201).json(newSale);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get recent sales
router.get('/', async (req, res) => {
  try {
    const sales = await Sale.find().sort('-saleDate').limit(10).populate('product');
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;