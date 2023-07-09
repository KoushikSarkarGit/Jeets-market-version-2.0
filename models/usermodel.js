const mongoose = require('mongoose')
const { Schema } = mongoose;

//creating schema
const ecommerceUser = new Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    landmark: {
        type: String,
        required: true
    },
    zipcode: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },

    role: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

//creating model
const Usermodel = mongoose.model('user', ecommerceUser);

module.exports = Usermodel;