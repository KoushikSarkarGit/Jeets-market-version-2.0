const express = require('express')
const router = express.Router()
const { validationResult } = require('express-validator');
const Usermodel = require('../models/usermodel');
const { encrytpassword } = require('../middlewares/registrationchecker');


let reg = async (req, res) => {
    const valerror = validationResult(req);
    let success = false;

    if (!valerror.isEmpty()) {
        return res.status(400).json({ success, msg: "please fill the form in instructed format", curerr: valerror.array() });
    }
    const { name, email, password, phone, address, city, state, landmark, zipcode, answer } = req.body;
    try {

        const user = await Usermodel.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success, msg: "user already exist" })
        }

        const hashed = await encrytpassword(password);


        const createduser = await Usermodel.create({ name, email, password: hashed, phone, address, city, state, landmark, zipcode, answer })
        success = true;
        return res.status(200).json({ success, created: createduser, msg: 'Account Created Successfully' })
    } catch (error) {
        success = false;
        console.log(error)
        return res.status(400).json({ success, msg: 'some internal error occured in register' })
    }

}

module.exports = reg;