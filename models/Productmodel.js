const mongoose = require('mongoose')
const { Schema } = mongoose;

//creating schema
const ecommerceProduct = new Schema({

    productname: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.ObjectId,
        ref: 'category'

    },
    quantity: {
        type: String,
        required: true
    },
    image: {
        data: Buffer,
        contentType: String,

    },
    shipping: {
        type: Boolean,
        required: true
    },
    manufacturer: {

        type: String,
        default: 'koushik'

    }


}, { timestamps: true });

//creating model
const Productmodel = mongoose.model('product', ecommerceProduct);

module.exports = Productmodel
    ;