const mongoose = require('mongoose');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');

/**
 * NOTE: https://stackoverflow.com/questions/7137397/module-exports-vs-exports-in-node-js
 * coulve be done with module.exports as well, no diff here really
 */

exports.get_all_orders = (req, res, next) => {
  Order.find()
    .select('product quantity _id')
    // populate will give the info or a peroduct
    // if filled, the second arg will give only specified fields
    .populate('product', 'name')
    .then((result) => {
      console.log(res.locals.userData);
      res.status(200).json({
        count: result.length,
        orders: result.map((item) => {
          return {
            _id: item._id,
            product: item.product,
            quantity: item.quantity,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/orders/' + item._id,
            },
          };
        }),
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

/**
 * passed upload.single() in the middle of the post()
 * can have as many middleware handlers as I want
 * they execute before the main handler
 */
exports.create_order = (req, res, next) => {
  // check if the product exists first
  Product.findById(req.body.productId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          message: 'Product not found',
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      });
      return order.save();
    })
    .then((result) => {
      res.status(200).json({
        message: 'Order created successfully',
        request: {
          type: 'GET',
          createdOrder: {
            _id: result._id,
            product: result.product,
            quantity: result.quantity,
          },
          url: 'http://localhost:3000/orders/' + result._id,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.get_order = (req, res, next) => {
  Order.findById(req.params.orderID)
    .select('quantity product _id')
    .populate('product')
    .then((result) => {
      if (!result) {
        return res.status(404).json({
          message: 'Order not found',
        });
      }
      res.status(200).json({
        order: result,
        request: {
          type: 'GET',
          url: 'http://localhost:3000/orders',
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.delete_order = (req, res, next) => {
  Order.deleteOne({ _id: req.params.orderID })
    .then((result) => {
      if (!result) {
        return res.status(404).json({
          message: 'No order found',
        });
      }
      res.status(200).json({
        order: result,
        request: {
          type: 'GET',
          url: 'http://localhost:3000',
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        err: error,
      });
    });
};
