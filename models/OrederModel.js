const mongoose = require('mongoose')
const { Schema } = mongoose;

//creating schema
const orderschema = new Schema(
    {
        products: [
            {
                type: mongoose.ObjectId,
                ref: "product",
            },
        ],
        payment: {},
        buyer: {
            type: mongoose.ObjectId,
            ref: "user",
        },
        status: {
            type: String,
            default: "Placed",
            enum: ["Placed", "Processing", "Shipped", "deliverd", "canceled"],
        },
    },
    { timestamps: true }

);

//creating model
const OrderModel = mongoose.model('orders', orderschema);

module.exports = OrderModel;