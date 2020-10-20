// setup, make a router
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/productModel');

// cause the incoming URL reqs will already be /products we only need to look for '/'
router.get('/', (req, res, next) => {
  Product.find()
    // select which fields are to be diplayed
    .select('name price _id')
    .then((result) => {
      // create an object to send as a response
      const response = {
        // some useful metadata
        count: result.length,
        products: result.map((item) => {
          return {
            name: item.name,
            price: item.price,
            _id: item._id,
            request: {
              type: 'GET',
              description: 'Get the product from',
              url: 'http://localhost:3000/products/' + item._id,
            },
          };
        }),
      };
      res.status(201).json({ responseObj: response });
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
          message: 'Product created successfully',
          createdProduct: {
            name: result.price,
            price: result.price,
            _id: result._id,
            request: {
              type: 'GET',
              description: 'Get the created product from',
              url: 'http://localhost:3000/products/' + result._id,
            },
          },
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
    .select('name price _id')
    .then((result) => {
      res.status(200).json({
        product: result,
        requiest: {
          type: 'GET',
          description: 'Get all products from',
          url: 'http://localhost:3000/products/',
        },
      });
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
      res.status(200).json({
        message: 'Product updated',
        request: {
          type: 'GET',
          description: 'Get the updated product from',
          url: 'http://localhost:3000/products' + id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete('/:productId', (req, res, next) => {
  const id = req.params.productId;
  Product.deleteOne({ _id: id })
    .then((result) => {
      res.status(200).json({
        message: 'Product deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/products',
          body: {
            name: 'String',
            price: 'Number',
          },
        },
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// export the router's handlers
module.exports = router;
