const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Store = require('../models/storeModel');

router.get('/', (req, res, next) => {
  Store.find()
    .then((result) => {
      res.status(200).json({
        count: result.length,
        orders: result.map((item) => {
          return {
            _id: item._id,
            name: item.name,
            products: item.products,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/stores/' + item._id,
            },
          };
        }),
      });
    });
});

router.post('/', (req, res, next) => {
  const store = new Store({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
  });
  store
    .save()
    .then((result) => {
      res.status(201).json({
        message: 'Store created',
        store: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        err: error,
      });
    });
});

router.get('/:storeId', (req, res, next) => {
  Store.findById(req.params.storeId)
    .then((store) => {
      res.status(200).json({
        store: store,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
