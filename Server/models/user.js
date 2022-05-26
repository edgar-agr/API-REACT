const mongoose =  require('mongoose');

const userSchema = mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    address:{
        street:{
            type:String,
        },
        city:{
            type:String,
        },
        country:{
            type:String,
        },
        zip:{
            type:Number,
        },
    },
    cart:[{
        plantId :{
            type: mongoose.Types.ObjectId,
            ref:'Plants',
            required:true },
        qty:{
            type:Number,
            required:true
        }
    }],
    role:{
        type:String,
        required:true
    },
    orders:[
        {
            orderId:{
            type:mongoose.Types.ObjectId,
            ref:'Orders',
            required:true
            }
        }
    ]
});

module.exports = mongoose.model('Users',userSchema);