// sales.js
const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Product = require('../models/Product');

// Record a sale with multiple items and a customer name.
router.post('/', async (req, res) => {
  try {
    const { customerName, customerAddress, customerPhoneNumber, items } = req.body;
    if (!customerName || !customerAddress || !customerPhoneNumber || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Customer name, adresss, number and sale items are required.' });
    }

    // Validate each item: ensure product exists and there is enough stock.
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found for ID: ${item.productId}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for product: ${product.name}` });
      }
    }

    // Deduct stock for each sale item.
    for (const item of items) {
      const product = await Product.findById(item.productId);
      product.stock -= item.quantity;
      await product.save();
    }

    // Create the sale record.
    const sale = new Sale({
      customerName,
      customerAddress,
      customerPhoneNumber,
      items: items.map(item => ({
        product: item.productId,
        quantity: item.quantity,
        salePrice: item.salePrice,
        company: item.company,
        newDiscountPercentage: item.newDiscountPercentage, // New field sent from the frontend.
      })),
    });

    const newSale = await sale.save();
    res.status(201).json(newSale);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get recent sales with populated product info in each sale item.
router.get('/', async (req, res) => {
  try {
    const sales = await Sale.find()
      .sort('-saleDate')
      .populate('items.product');
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single sale by ID with populated product info (for the receipt view)
router.get('/:id', async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate('items.product');
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    res.json(sale);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
