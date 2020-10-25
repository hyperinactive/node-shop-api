const mongoose = require('mongoose');
const Product = require('../models/productModel');
const User = require('../models/userModel');

exports.get_all_products = (req, res, next) => {
  Product.find()
    // select which fields are to be diplayed
    .select('name price _id productImage seller')
    .populate('seller', 'username')
    .then((result) => {
      // create an object to send as a response
      const response = {
        // some useful metadata
        count: result.length,
        products: result.map((item) => {
          return {
            name: item.name,
            price: item.price,
            seller: item.seller,
            _id: item._id,
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
  // make a product and add it to the db
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
    seller: res.locals.userData.userId,
  });
  // handle the promise
  product
    .save()
    .then((result) => {
      // const user = await User.findById(res.locals.userData.userId);
      if (result) {
        /**
         * nested .then()???
         * async what???
         * I know it's ugly, but it works for now so ughh... don't be me
         */ 
        User.findById(res.locals.userData.userId).then((user) => {
          if (user) {
            user.products.push(result);
            user.save();
          } else {
            res.status(404).json({
              message: 'No user with that id found',
            });
          }
        });

        res.status(201).json({
          message: 'Product created successfully',
          createdProduct: {
            name: result.name,
            price: result.price,
            _id: result._id,
            seller: result.seller,
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
      res.status(500).json({ error: err });
    });
};

exports.get_product = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select('name price _id productImage seller')
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
