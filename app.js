// init dependencies
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// init the express app
const app = express();

// get the routes for products and orders
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  {
    // to solve the deprecated errors
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.connection.on('connected', () => {
  console.log('connected to mongodb oh hell yea');
});

mongoose.connection.on('error', () => {
  console.log('error connecting to mongodb oh hell yea');
});

// make the files from 'uploads' public
// only look for requests at /uploads
app.use('/uploads', express.static('uploads'));
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
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  // before POST/PUT/PATCH reqs, browsers will always send OPTIONS req first
  if (req.method === 'OPTIONS') {
    // enable these reqs
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  // allows the app to continue if all is good
  next();
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
