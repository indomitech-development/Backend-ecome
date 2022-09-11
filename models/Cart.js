const mongoose = require('mongoose');

const Schema = mongoose.Schema

const StaffSchema = new Schema({
    Products: {
        type: Array,
        required: true
    }
});

module.exports = mongoose.model('Cart', StaffSchema);