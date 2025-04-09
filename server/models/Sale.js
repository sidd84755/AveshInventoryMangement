// sale.js
const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema({
  product: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: { 
    type: Number, 
    required: true 
  },
  salePrice: {
    type: Number,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  newDiscountPercentage: {
    type: Number,
    required: false
  }
});

const saleSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  customerAddress: {
    type: String,
    required: true,
  },
  customerPhoneNumber: {
    type: Number,
    required: true,
  },
  items: [saleItemSchema],
  saleDate: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Sale', saleSchema);
