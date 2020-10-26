const express = require('express');
const router = express.Router();
const authentication = require('../middleware/authentication');
const UserController = require('../controllers/userController');

router.get('/', authentication, UserController.get_all_users);
router.post('/signup', UserController.signup);
router.post('/login', UserController.login);
router.delete('/:userId', authentication, UserController.delete);

module.exports = router;
