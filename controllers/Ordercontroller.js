const express = require('express')
const braintree = require('braintree')



const OrderModel = require('../models/OrederModel')
require('dotenv').config()


var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});



const tokengiver = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(response);
            }
        });
    } catch (error) {
        console.log(error);
    }

}


const finalpayment = async (req, res) => {

    try {
        const { nonce, cart } = req.body;
        let total = 0;
        cart.map((i) => {
            total += i.price;
        });
        let newTransaction = gateway.transaction.sale(
            {
                amount: total,
                paymentMethodNonce: nonce,
                options: {
                    submitForSettlement: true,
                },
            },
            function (error, result) {
                if (result) {

                    if (cart.length > 1) {

                        cart.map((item) => {
                            const order = new OrderModel({
                                products: item,
                                payment: result,
                                buyer: req.customer_id,
                            }).save();
                        })

                    }

                    else {

                        const order = new OrderModel({
                            products: cart,
                            payment: result,
                            buyer: req.customer_id,
                        }).save();
                    }




                    res.json({ ok: true });
                } else {
                    res.status(500).send(error);
                }
            }
        );
    } catch (error) {
        console.log(error);
    }

}



//get all orders based on customer id
const getorderbycustomerid = async (req, res) => {
    try {
        const orders = await OrderModel.find({ buyer: req.customer_id }).populate("products", "-image").populate("buyer", "name");
        res.status(200).json(orders);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            msg: "Error WHile Geting Orders",
            error,
        });
    }
};


// get all orders (for admin page)
const getllOrders = async (req, res) => {
    try {
        const orders = await OrderModel
            .find({})
            .populate("products", "-image")
            .populate("buyer", "name")
            .sort({ createdAt: "-1" });
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error WHile Geting Orders",
            error,
        });
    }
};

// Change Order Status (for admin page)
const changeOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const orders = await OrderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error While Updating Order",
            error,
        });
    }
};



module.exports = { tokengiver, finalpayment, getorderbycustomerid, getllOrders, changeOrderStatus }
