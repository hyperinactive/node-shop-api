const mongoose = require('mongoose');

// deprecation warning handler for 'unique' field
mongoose.set('useCreateIndex', true);

const userSchema = new mongoose.Schema({
  // serial id number types.objectid
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    required: true,
    // unique doesn't actaully validate anything, it is used for optimization
    unique: true,
    // regex to match against
    match: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
  ],
  currency: {
    type: Number,
    default: 0,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'superuser'],
    default: 'user',
  },
});

// make a model and export it
module.exports = new mongoose.model('User', userSchema);
