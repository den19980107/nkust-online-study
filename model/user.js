const mongoose = require('mongoose');

//User Schema
const UserSchema = mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    schoolname: {
        type: String
    },
    department: {
        type: String
    },
    studentid: {
        type: String
    },
    permission: {
        type: String,
        require: true
    },
    userInfo: {
        type: String
    },
    InActive: {
        type: Boolean,
        default: false
    }

});


const User = module.exports = mongoose.model('User', UserSchema);