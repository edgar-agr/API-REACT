const Order = require('../models/order');
const User = require('.../models/user');

exports.getUserOrders = (req,res,next) => {
    const id = req.params.id;
    const page = req.query.page || 1;
    const perPage = 5;

    User
        .findById(id)
        .then(user => {
            if(!user) {
                const error = new Error('User not found');
                error.statusCode = 404;
                throw error;
            }

            if(user.orders.length === 0){
                res.status(200).json({
                    message:"There are no orders",
                    orders:user.orders
                });
            }
            else{

                if(user.orders.length < (page-1)*perPage){
                    const error = new Error('Invalid page number');
                    error.statusCode = 422;
                    throw error
                }

                const ordersTotal = user.orders.length;

                User
                    .findById(id)
                    .populate('orders')
                    .sort({ createdAt: 'desc'})
                    .skip((page-1)*perPage)
                    .limit(perPage)
                    .then(orders => {
                        
                        res.status(200).json({
                            message:"Order found succesfully",
                            orders:orders,
                            totalOrders: ordersTotal,
                            page:page,
                            perPage:perPage
                        });
                    })
            }
        })
        .catch(error => {
            if(!error.statusCode){
                error.statusCode = 500;
            }
            next(error);
        })
};

exports.addOrder = (req,res,next) => {
    const id = req.body.id;
    const cart = req.body.cart;
    let userInfo;

    User
        .findById(id)
        .then(user => {
            if(!user) {
                const error = new Error('User not found');
                error.statusCode = 404;
                throw error;
            }

            user.cart = cart;
            return user.save();
        })
        .populate('cart.plant')
        .then(user => {
            const plants = [];
            const count = user.cart.length;
            let totalCost = 0;
                        
            user.cart.forEach(elementInCart => {
                if(elementInCart.plant){
                    plants.push({
                        plant:elementInCart.plant,
                        qty:plant.qty});
                    totalCost += plant.qty * elementInCart.plant.price
                }
            });

            if(count !== order.length){
                const error = new Error('Invalid items in the order');
                error.statusCode = 422;
                throw error;
            }

            const order = new Order({
                plants:plants,
                totalCost:totalCost,
                userId:user._id
            });

            userInfo = user;

            return order.save();
        })
        .then(order => {
            userInfo.orders.push({
                orderId: order._id,
            });

            return userInfo.save()
        })
        .then(user => {
            res.status(201).json({
                message:'Order created succesfully'
            });
        })
        .catch(error => {
            if(!error.statusCode){
                error.statusCode = 500;
            }
            next(error);
        });
};

exports.getOrder = (req,res,next) => {
    const id = req.params.id;

    Order   
        .findById(id)
        .then(order => {
            if(!order) {
                const error = new Error('Order not found');
                error.statusCode = 404;
                throw error;
            }

            res.status(200).json({
                message:"Order found",
                order:order
            })
        })
        .catch(error =>{
            if(!error.statusCode){
                error.statusCode = 500;
            }
            next(error);
        })
};