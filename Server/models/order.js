const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    plants:[{
        plantId :{
            type: mongoose.Types.ObjectId,
            ref:'Plants',
            required:true },
        qty:{
            type:Number,
            required:true
        }
    }],
    userId:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    totalCost:{
        type:Number,
        required:true
    }
},{timestamps:true});

module.exports = mongoose.model('Orders',orderSchema);