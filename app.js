// init dependencies
const express = require('express');
const app = express();
const morgan = require('morgan');

// get the routes for products and orders
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

// dev is a format of the output
// morgan will track requests and log then into the terminal
app.use(morgan('dev'));

// every URL targeting /products will be handled by productsRoutes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// if the code gets past the previoys two lines -> means the URL didn't match and we handle errors
// catch errors with the wrong URL
app.use((req, res, next) => {
  const error = new Error('URL not found');
  error.status = 404;
  next(error);
});

// catch all other errors
app.use((error, req, res, next) => {
  // if the error isn't one our own customs return a 500
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

// export app to be used in the server.js
module.exports = app;
