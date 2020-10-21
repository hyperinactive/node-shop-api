// init the model, require the mongoose driver
const mongoose = require('mongoose');

// make schema
const productSchema = new mongoose.Schema({
  // serial id number types.objectid
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, require },
  price: { type: Number, require },
  productImage: {
    type: String,
    required: true,
  },
});

// make a model and export it
module.exports = new mongoose.model('Product', productSchema);
