// init the model, require the mongoose driver
const mongoose = require('mongoose');

// make schema
const productSchema = new mongoose.Schema({
  // serial id number types.objectid
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  price: Number,
});

// make a model and export it
module.exports = new mongoose.model('Product', productSchema);
