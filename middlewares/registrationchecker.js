const bcrypt = require('bcrypt');
const Usermodel = require('../models/usermodel');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
require('dotenv').config();



const encrytpassword = async (password) => {
    try {

        const saltRounds = 10;
        const hashedpassword = await bcrypt.hash(password, saltRounds);
        return hashedpassword;

    } catch (error) {
        console.log(error)
    }
}

const checkpassword = async (password, hashedpassword) => {
    const result = bcrypt.compare(password, hashedpassword);
    return result;
}


const isAdmin = async (req, res, next) => {
    try {
        decoded = await jwt.verify(req.headers.token, process.env.jwt_secret_key)

        const user = await Usermodel.findById(decoded.id);
        if (user.role !== 1) {
            return res.status(401).json({
                success: false,
                msg: "UnAuthorized Access",
            });
        } else {
            next();
        }


    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            error,
            msg: "Error in admin middelware",
        });
    }
};


const requireSignIn = async (req, res, next) => {
    try {
        const decode = jwt.verify(
            req.headers.token,
            process.env.jwt_secret_key
        );
        req.customer_id = decode.id;
        next();
    } catch (error) {
        console.log(error);
    }
};



module.exports = { encrytpassword, checkpassword, isAdmin, requireSignIn }