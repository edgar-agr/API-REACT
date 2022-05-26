const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = (req,res,next) => {
    // validation
    const email = req.body.email;
    const password = req.body.password;
    let user;

    User
        .findOne({email:email})
        .then(result => {
            if(!result){
                const error = new Error('User not found');
                error.statusCode = 404;
                throw error;
            }

            user = result;

            return bcrypt.compare(password, result.password);
        })
        .then(validation => {
            if(!validation){
                const error = new Error('Wrong password');
                error.statusCode = 401;
                throw error;
            }

            // Falta agregar un token para validar sesion
            res.status(200).json({
                message:'Login successfully',
                user: user._id,
                password: user.password
            });
        })
        .catch(error => {
            if(!error.statusCode){
                error.statusCode = 500;
            }
            next(error);
        })
};

exports.addUser = (req,res,next) => {
    // validation
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const phone = req.body.phone;
    const email = req.body.email;
    const address = req.body.address;
    const role = 'User';
    const password = req.body.password;

    User
        .findOne({email:email})
        .then(result => {
            if(result){
                const error = new Error('Email already used');
                error.statusCode = 422;
                throw error;
            }

            return bcrypt.hash(password,12);
        })
        .then(hashedPassword => {

            const user = new User({
                firstName:firstName,
                lastName:lastName,
                email:email,
                password: hashedPassword,
                address:address,
                phone:phone,
                role:role,
                cart:[],
                orders:[]
            });

        return user.save();

        })
        .then(result=>{
            res.status(201).json({
                message:'User added',
                email:email
            })
        })
        .catch(error => {
            if(!error.statusCode){
                error.statusCode = 500;
            }
            next(error);
        })
};

exports.editUserInfo = (req,res,next) => {
    //validation
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const phone = req.body.phone;
    const address = req.body.address;
    const id = req.body.id;

    User
        .findById(id)
        .then(user => {
            if(!user){
                const error = new Error('User not found');
                error.statusCode = 404;
                throw error; 
            }

            user.firstName = firstName;
            user.lastName = lastName;
            user.phone = phone;
            user.address = address;

            return user.save();
        })
        .then(result => {
            res.status(200).json({
                message:"User updated",
            })
        })
        .catch(error => {
            if(!error.statusCode){
                error.statusCode = 500;
            }
            next(error);
        });
};

exports.deleteUser = (req,res,next) => {
    const id = req.body.id;

    User
        .findById(id)
        .then(user => {
            if(!user){
                const error = new Error('User not found');
                error.statusCode = 404;
                throw error; 
            }

            return User.findByIdAndDelete(id);
        })
        .then(result => {
            res.status(200).json({
                message:"user deleted",
            })
        })
        .catch(error => {
            if(!error.statusCode){
                error.statusCode = 500;
            }
            next(error);
        });
};

exports.getUser = (req,res,next) => {
    const id = req.params.id;

    if(!id){
        const error = new Error('Insert an id');
        error.statusCode = 422;
        throw error; 
    }

    User
        .findById(id)
        .then(user => {
            if(!user){
                const error = new Error('User not found');
                error.statusCode = 404;
                throw error; 
            }

            const response = {
                firstName:user.firstName,
                lastName:user.lastName,
                phone:user.phone,
                address:user.address,
                cart:user.cart,
                orders:user.orders,
                role:user.role
            };

            res.status(200).json({
                message:"User found",
                user:response
            })

        })
        .catch(error => {
            if(!error.statusCode){
                error.statusCode = 500;
            }
            next(error);
        });
};

exports.getCart = (req,res,next) => {
    const id  = req.body.id;
    let cartCount;
    let userInfo;

    User
        .findById(id)
        .then(user => {
            if(!user){
                const error = new Error('User not found');
                error.statusCode = 404;
                throw error; 
            }

            if(user.cart.length === 0){
                res.status(200).json({
                    message:"The cart is empty",
                    cart:[]
                })
            }

            cartCount = user.cart.length;
            userInfo = user;

            return User.findById(id).populate('cart.plantId');
        })
        .then(user => {
            const cart = user.cart.map(plant => {
                if(plant.name){
                    return plant._id;
                }
            })

            if(cartCount === cart.length){
                res.status(200).json({
                    message:"The cart is complete",
                    cart: user.cart
                })
            }

            userInfo.cart = cart;

            return userInfo.save();
        })
        .then(updatedUserCart => {

            if(updatedUserCart.cart.length === 0){
                res.status(206).json({
                    message:"All the plants are no longer available",
                    cart:[],
                    prevItems: cartCount,
                    actualItems: 0
                })
            }

            res.status(206).json({
                message:"Some plants are no longer available",
                cart:updatedUserCart.cart,
                prevItems: cartCount,
                actualItems: updatedUserCart.cart.length
            })
        })
        .catch(error => {
            if(!error.statusCode){
                error.statusCode = 500;
            }
            next(error);
        })
};

exports.updateCart = (req,res,next) => {
    const id  = req.body.id;
    const cart = req.body.cart;

    User
        .findById(id)
        .then(user => {
            if(!user){
                const error = new Error('User not found');
                error.statusCode = 404;
                throw error; 
            }

            user.cart = cart;
            return user.save();
        })
        .then(userCart => {

            if(userCart.cart.length === 0){
                res.status(200).json({
                    message:"The cart is empty",
                    cart:[]
                })
            }

            res.status(200).json({
                message:"The cart is complete",
                cart: userCart.cart
            })
        })
        .catch(error => {
            if(!error.statusCode){
                error.statusCode = 500;
            }
            next(error);
        })

};

exports.deleteCart = (req,res,next) => {
    const id  = req.body.id;

    User
        .findById(id)
        .then(user => {
            if(!user){
                const error = new Error('User not found');
                error.statusCode = 404;
                throw error; 
            }

            if(userCart.cart.length === 0){
                res.status(200).json({
                    message:"The cart is already empty",
                    cart:[]
                });
            }

            user.cart = [];
            return user.save();
        })
        .then(userCart => {


            res.status(200).json({
                message:"The cart is complete",
                cart: userCart.cart
            })
        })
        .catch(error => {
            if(!error.statusCode){
                error.statusCode = 500;
            }
            next(error);
        })

};