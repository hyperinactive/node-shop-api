// setup, make a router
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/productModel');

// cause the incoming URL reqs will already be /products we only need to look for '/'
router.get('/', (req, res, next) => {
  Product.find()
    .then((result) => {
      console.log(result);
      res.status(201).json({ result });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post('/', (req, res, next) => {
  // make a product and add it to the db
  console.log('called');
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });
  // handle the promise
  product
    .save()
    .then((result) => {
      console.log(result);
      if (result) {
        res.status(201).json({
          message: 'Handler for POST @ /products, yay!',
          createdProduct: product,
        });
      } else {
        res.status(404).json({
          message: 'No item matches the id',
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

// in express :<any name afterwards> will handle reqs sent with the name specified
// :<param> will appear in params so it can be extracted
router.get('/:productId', (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      // pass the error as well
      res.status(500).json({ error: err });
    });
});

router.patch('/:productId', (req, res, next) => {
  const id = req.params.productId;
  /**
   * make an object of things to change in the db entry
   * loop over the body of the request
   * populate object with the changes from the request
   */
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update(
    { _id: id },
    // $set expects an object
    { $set: updateOps }
  )
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete('/:productId', (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// export the router's handlers
module.exports = router;
