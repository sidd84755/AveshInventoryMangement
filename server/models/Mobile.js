const mongoose = require('mongoose');

const mobileSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  },
  category: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Export just the schema
module.exports = mobileSchema;