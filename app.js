// init dependencies
const express = require('express');
const app = express();

// get the routes for products
const productRoutes = require('./api/routes/products');

// every URL targeting /products will be handled by productsRoutes
app.use('/products', productRoutes);

// export app to be used in the server.js
module.exports = app;