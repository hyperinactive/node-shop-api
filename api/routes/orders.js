// setup, make a router
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Execute order 66',
  });
});

router.post('/', (req, res, next) => {
  res.status(201).json({
    message: 'Execute order 66',
  });
});

router.get('/:orderID', (req, res, next) => {
  res.status(200).json({
    message: 'Order detail',
    orderID: req.params.orderID,
  });
});

router.delete('/:orderID', (req, res, next) => {
  res.status(200).json({
    message: 'Order deleted',
    orderID: req.params.orderID,
  });
});

module.exports = router;
