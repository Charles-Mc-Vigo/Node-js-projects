const mongoose = require('mongoose');
const shortId = require('shortid')

const signUpSchema = new mongoose.Schema({
    _id:{
        type:String,
        default:shortId.generate
    },
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required: true
    }
})

module.exports = mongoose.model('SignUp', signUpSchema);