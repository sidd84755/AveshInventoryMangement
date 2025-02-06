// sale.js
const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
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
  saleDate: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Sale', saleSchema);
