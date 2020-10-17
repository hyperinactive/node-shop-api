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
  const product = {
    name: req.body.name,
    price: req.body.price,
  };
  res.status(201).json({
    message: 'Handler for POST @ /products, yay!',
    createdProduct: product,
  });
});

// in express :<any name afterwards> will handle reqs sent with the name specified
// :<param> will appear in params so it can be extracted
router.get('/:productID', (req, res, next) => {
  const id = req.params.productID;
  if (id === 'penguin') {
    res.status(200).json({
      messsage: 'Aha, a Linux user!',
      id: id,
    });
  } else {
    res.status(200).json({
      messsage: 'Sigh',
    });
  }
});

router.patch('/:productID', (req, res, next) => {
  res.status(200).json({
    message: 'Products updated (but not really)',
  });
});

router.delete('/:productID', (req, res, next) => {
  res.status(200).json({
    message: "Products deleted (please don't look for it)",
  });
});

// export the router's handlers
module.exports = router;
