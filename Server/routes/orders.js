const express = require('express');

const orderController = require('../controller/orders');

const router = express.Router();

router.get('userOrders/:id',orderController.getUserOrders);

router.post('userorder',orderController.addOrder);

router.get('order/:id',orderController.getOrder)


module.exports = roter;