const mongoose = require('mongoose');
const Product = require('../models/productModel');
const Store = require('../models/storeModel');

exports.get_all_products = (req, res, next) => {
  Product.find()
    // select which fields are to be diplayed
    .select( 'name price _id productImage store')
    .populate('store', 'name')
    .then((result) => {
      // create an object to send as a response
      const response = {
        // some useful metadata
        count: result.length,
        products: result.map((item) => {
          console.log(item.store);
          return {
            name: item.name,
            price: item.price,
            _id: item._id,
            store: item.store,
            productImage: item.productImage,
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
      res.status(500).json({
        error: err,
      });
    });
};

exports.create_product = (req, res, next) => {
  Store.findById(req.body.storeId)
    .then((store) => {
      if (!store) {
        return res.status(404).json({
          message: 'Store not found',
        });
      }
      const product = new Product({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path,
        store: req.body.storeId,
      });
      return product.save();
    })
    .then((result) => {
      if (result) {
        res.status(201).json({
          message: 'Product created successfully',
          createdProduct: {
            name: result.name,
            price: result.price,
            store: result.store,
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
      res.status(500).json({
        error: err,
      });
    });
};

exports.get_product = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select('name price _id productImage')
    .then((result) => {
      res.status(200).json({
        product: result,
        request: {
          type: 'GET',
          description: 'Get all products from',
          url: 'http://localhost:3000/products/',
        },
      });
    })
    .catch((err) => {
      // pass the error as well
      res.status(500).json({
        error: err,
      });
    });
};

exports.update_product = (req, res, next) => {
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
      res.status(500).json(err);
    });
};

exports.delete_product = (req, res, next) => {
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
};
