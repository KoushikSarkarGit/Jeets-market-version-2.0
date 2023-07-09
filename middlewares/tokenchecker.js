const jwt = require('jsonwebtoken');
require('dotenv').config();


const valtoken = async (req, res, next) => {
    const reqtoken = await req.headers.token;
    let success = false;
    try {
        var tokencheck = await jwt.verify(reqtoken, process.env.jwt_secret_key);
        if (!tokencheck) {
            return res.status(400).json({ success: true, msg: "invalid email or password" })
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, msg: "error happened in tokenchecker" })
    }
}

module.exports = valtoken;