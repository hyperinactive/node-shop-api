// init dependencies
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

// init the express app
const app = express();

// get the routes for products and orders
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

// dev is a format of the output
// morgan will track requests and log them into the terminal
app.use(morgan('dev'));
// false -> simple body data
app.use(bodyParser.urlencoded({ extended: false }));
// extracts json data
app.use(bodyParser.json());

/**
 * CORS handling
 * before proceeding with the URL, we adjust the header
 * must enable access to all (can also restrict it)
 */
app.use((req, res, next) => {
  res.header('Access-Control-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-requested-With, Content-Type, Accept, Authorization'
  );
  // before POST/PUT/PATCH reqs, browsers will always send OPTIONS req first
  if (req.method === 'OPTIONS') {
    // enable these reqs
    req.header('Access-Control-Allow-Methods', 'PUT', 'POST', 'PATCH', 'DELETE', 'GET');
    req.status(200).json({});
  }
});

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
  // if the error isn't one of our own customs return a 500
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

// export app to be used in the server.js
module.exports = app;
