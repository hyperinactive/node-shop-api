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
});

// make a model and export it
module.exports = new mongoose.model('Order', orderSchema);
