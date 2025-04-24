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

router.put('/:id', async (req, res) => {
  try {
    const updated = req.body;
    const sale = await Sale.findById(req.params.id);
    if (!sale) return res.status(404).json({ message: 'Sale not found' });

    // 1. Update customer info
    sale.customerName = updated.customerName;
    sale.customerAddress = updated.customerAddress;
    sale.customerPhoneNumber = updated.customerPhoneNumber;

    // 2. Map original quantities
    const origQtyMap = {};
    sale.items.forEach(i => {
      origQtyMap[i.product.toString()] = i.quantity;
    });

    // 3. Adjust stock based on delta
    for (const item of updated.items) {
      const prodId = item.product._id || item.product;
      const product = await Product.findById(prodId);
      if (!product) {
        return res.status(404).json({ message: `Product ${prodId} not found` });
      }

      const origQty = origQtyMap[prodId] || 0;
      const delta = item.quantity - origQty;
      // If delta > 0, more sold → deduct; if delta < 0, items returned → add back
      if (delta > 0 && product.stock < delta) {
        return res
          .status(400)
          .json({ message: `Insufficient stock for ${product.name}` });
      }
      product.stock -= delta;
      await product.save();
    }

    // 4. Save updated items array
    sale.items = updated.items.map(i => ({
      product: i.product._id || i.product,
      quantity: i.quantity,
      salePrice: i.salePrice,
      company: i.company
    }));

    await sale.save();
    res.json(sale);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    // 1. Find the sale
    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    // 2. Restock each product
    for (const item of sale.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    // 3. Remove the sale record
    await sale.remove();

    res.json({ message: 'Sale deleted and stock updated' });
  } catch (err) {
    console.error('Error deleting sale:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
