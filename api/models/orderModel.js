const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // serial id number types.objectid
  _id: mongoose.Schema.Types.ObjectId,
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  buyer: {
    type: String,
    ref: 'User',
    required: true,
  },
  createdAt: {
    required: true,
    type: Date,
    set: Date.now,
    default: Date.now,
  },
});

// make a model and export it
module.exports = new mongoose.model('Order', orderSchema);
