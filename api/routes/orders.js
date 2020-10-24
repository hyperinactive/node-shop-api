// setup, make a router
const express = require('express');
const router = express.Router();
// import auth middleware
const authentication = require('../middleware/authentication');
// import the controller
const OrderController = require('../controllers/orderController');

router.get('/', authentication, OrderController.get_all_orders);
router.post('/', authentication, OrderController.create_order);
router.get('/:orderID', authentication, OrderController.get_order);
router.delete('/:orderID', authentication, OrderController.delete_order);

module.exports = router;
