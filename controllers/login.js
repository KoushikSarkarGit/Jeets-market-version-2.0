const express = require('express')
const router = express.Router()
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')
const { checkpassword } = require('../middlewares/registrationchecker');
const Usermodel = require('../models/usermodel');
require('dotenv').config();

const loginfunction = async (req, res) => {
    const valerror = validationResult(req);
    let success = false;
    if (!valerror.isEmpty()) {
        return res.status(400).json({ success, msg: "please fill the form in instructed format", curerr: valerror.array() });
    }

    try {
        const { email, password } = req.body;
        const user = await Usermodel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ success, msg: "user does not exist. Please Sign Up first" })
        }

        const passwordchecking = checkpassword(password, user.password)

        if (!passwordchecking) {
            return res.status(400).json({ success, msg: "invalid email or password" })
        }

        const token = jwt.sign({ id: user._id }, process.env.jwt_secret_key, { expiresIn: '7d' });
        success = true;
        return res.status(200).json({ success, jwttoken: token, name: user.name, role: user.role, msg: "Login Successful" })

    } catch (error) {
        console.log(error)
        success = false;
        return res.status(500).json({ success, msg: "some internal error happened" })
    }

}


module.exports = loginfunction;