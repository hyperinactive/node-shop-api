// setup, make a router
const express = require('express');
const router = express.Router();

// cause the incoming URL reqs will already be /products we only need to look for '/'
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Handler for GET @ /products, yay!',
  });
});

router.post('/', (req, res, next) => {
  res.status(200).json({
    message: 'Handler for POST @ /products, yay!',
  });
});

// export the router's handlers
module.exports = router;