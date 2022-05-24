const mongoose = require('mongoose');

const plantsSchema = mongoose.Schema({
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
})

module.exports = mongoose.model('Plants',plantsSchema);