const mongoose = require('mongoose');

const Schema = mongoose.Schema

const checkout = new Schema({
    customer_id: {
        type: String,
        required: true,
    },
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
    },
    address: {
        type: String,
        required: true
    },
    zipcode: {
        type: String,
        required: true
    },

    products : {
        type : Array
    },
    amount: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('CheckOuts', checkout);