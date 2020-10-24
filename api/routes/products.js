// setup, make a router
const express = require('express');
const router = express.Router();
const authentication = require('../middleware/authentication');
const upload = require('../middleware/multer');

const ProductController = require('../controllers/productsController');

// cause the incoming URL reqs will already be /products we only need to look for '/'
router.get('/', ProductController.get_all_products);
router.post('/', authentication, upload.single('productImage'), ProductController.create_product);

// in express :<any name afterwards> will handle reqs sent with the name specified
// :<param> will appear in params so it can be extracted
router.get('/:productId', ProductController.get_product);

router.patch('/:productId', authentication, ProductController.update_product);

router.delete('/:productId', authentication, ProductController.delete_product);

// export the router's handlers
module.exports = router;
