const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CencelappointmentSchema = new Schema({

    fname: {
        type: String,
        // required: true
    },
    lname:{
        type:String,
        // required : true
    },

    appointDate:{
     type: String,
    },
    email :{
        type : String,
        // required : true
    },
 
    hospital: {
        type: String,
        // required: true
    },
    
    name_doctor: {
        type: String,
        // required: true
    },
    minuts: {
        type: String
    },
    hours: {
        type: String,
        // default: Date.now
    },

    cencel :{
        type: Boolean,
        default : false
    }
    
});

const CencelAppointment = mongoose.model('cencelappointment', CencelappointmentSchema);

module.exports = CencelAppointment;