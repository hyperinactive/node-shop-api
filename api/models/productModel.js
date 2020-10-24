// init the model, require the mongoose driver
const mongoose = require('mongoose');

// make schema
const productSchema = new mongoose.Schema({
  // serial id number types.objectid
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  productImage: {
    type: String,
    required: true,
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Store',
  },
});

// make a model and export it
module.exports = new mongoose.model('Product', productSchema);
