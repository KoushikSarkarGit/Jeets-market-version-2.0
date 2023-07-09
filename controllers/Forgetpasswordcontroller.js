const express = require('express')
const Usermodel = require('../models/usermodel')
const { encrytpassword } = require('../middlewares/registrationchecker')
const { validationResult } = require('express-validator');



const Forgetpasswordcontroller = async (req, res) => {

    const valerror = validationResult(req);
    let success = false;
    if (!valerror.isEmpty()) {
        return res.status(400).json({ success, msg: "please fill the form in instructed format", curerr: valerror.array() });
    }


    const user = await Usermodel.findOne({ email: req.body.email, answer: req.body.answer })

    if (!user) {
        res.status(400).json({ success: false, msg: 'email or secret answer is not valid' })
    }

    try {

        const newhashedpasword = await encrytpassword(req.body.newpassword)

        const newuser = await Usermodel.findByIdAndUpdate(user._id, { password: newhashedpasword })
        res.status(200).json({ success: true, msg: 'Password Reset Successful' })

    } catch (error) {
        res.status(500).json({ success: false, msg: 'some internal error occured in forgetpassword', errorMessage: error })
    }

}


module.exports = Forgetpasswordcontroller;