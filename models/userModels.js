const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        require:[true,'name is required']
    },
    email:{
        type:String,
        require:[true,'email is required']
    },
    password:{
        type:String,
        require:[true,'password is reqiured']
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    isDoctor:{
        type:Boolean,
        default:false
    },
    notification:{
        type:Array,
        default:[],
    },
    seenNotification:{
        type:Array,
        default:[],
    },

})

const userModels= mongoose.model('users',UserSchema)
module.exports= userModels;