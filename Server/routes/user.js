const express = require('express')
const userController = require('../controller/user')

const router = express.Router();

router.post('/login',userController.login);

router.post('/user',userController.addUser);

router.put('/user',userController.editUserInfo);

router.delete('/user',userController.deleteUser);

router.get('/user/:id',userController.getUser);

router.get('/cart/:id',userController.getCart);

router.post('/cart',userController.updateCart);

router.delete('/cart',userController.deleteCart);

module.exports = router;