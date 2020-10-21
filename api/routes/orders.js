// setup, make a router
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/orderModel');
const Product = require('../models/productModel');

router.get('/', (req, res, next) => {
  Order.find()
    .select('product quantity _id')
    // populate will give the info or a peroduct
    // if filled, the second arg will give only specified fields
    .populate('product', 'name')
    .then((result) => {
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
});
/**
 * passed upload.single() in the middle of the post()
 * can have as many middleware handlers as I want
 * they execute before the main handler
 */
router.post('/', (req, res, next) => {
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
      console.log(result);
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
});

router.get('/:orderID', (req, res, next) => {
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
});

router.delete('/:orderID', (req, res, next) => {
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
});

module.exports = router;
