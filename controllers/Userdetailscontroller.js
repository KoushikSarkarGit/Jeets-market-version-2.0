const express = require('express');
const Usermodel = require('../models/usermodel');
const router = express.Router()
require('dotenv').config();
const jwt = require('jsonwebtoken')

let getuserdetails = async (req, res) => {
    let success = false;
    const requesttolken = await req.headers.token;
    decoded = await jwt.verify(req.headers.token, process.env.jwt_secret_key)
    try {
        const preuser = await Usermodel.findById(decoded.id);

        const user = await {
            _id: preuser._id,
            name: preuser.name,
            email: preuser.email,
            phone: preuser.phone,
            city: preuser.city,
            state: preuser.state,
            address: preuser.address,
            landmark: preuser.landmark,
            zipcode: preuser.zipcode,
            answer: preuser.answer,
            role: preuser.role,
            createdAt: preuser.createdAt,
            updatedAt: preuser.updatedAt,
            __v: preuser.__v
        };

        res.status(200).json({
            success: true,
            msg: "User Data fetching Successful",

            userdetails: user
        })


    } catch (error) {
        console.log(error)

        res.status(401).json({
            success: false,
            msg: "Something went wrong in userdetailscontroller"
        })

    }

}



const updateuserdetails = async (req, res) => {
    let success = false;
    const requesttolken = await req.headers.token;
    decoded = await jwt.verify(req.headers.token, process.env.jwt_secret_key)
    const { name, email, phone, address, city, state, landmark, zipcode } = req.body;
    try {
        const updateduser = await Usermodel.findByIdAndUpdate(decoded.id, { name, email, phone, address, city, state, landmark, zipcode }, { new: true });



        res.status(200).json({
            success: true,
            msg: "User Data Updated Successful",

            userdetails: updateduser
        })


    } catch (error) {
        console.log(error)

        res.status(401).json({
            success: false,
            msg: "Something went wrong in userdetailscontroller"
        })

    }

}







module.exports = { getuserdetails, updateuserdetails };