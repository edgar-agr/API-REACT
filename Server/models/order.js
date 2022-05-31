const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    plants:[{
        plant :{
            name:{
                type:String,
                required:true
            },
            description:{
                type:String,
                required:true
            },
            price:{
                type:Number,
                required:true
            },
            imgUrl:{
                type:String,
                required:true
            },
            ecosystem:{
                type:String,
                required:true
            }
        },
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