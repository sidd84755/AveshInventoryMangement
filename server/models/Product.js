const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  company: { type: String, required: true },
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: false },
  costPrice: { type: Number, required: true },
  stock: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);