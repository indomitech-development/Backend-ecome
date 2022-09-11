const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified:
     { type: Boolean, 
        default: false
     },
    resetPasswordToken:
    {
        type: String,
    },
    resetPasswordExpires:
    {
        type : String,
    },
    avatar: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Admin = mongoose.model('admins', UserSchema);

module.exports = Admin;