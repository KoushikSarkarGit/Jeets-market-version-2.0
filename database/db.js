const mongoose = require('mongoose');
require('dotenv').config()



const mongouri = process.env.mongo_uri

const connectToMongo = () => {


    try {
        mongoose.connect(mongouri).then(() => {
            console.log('connected to ecommerce app database')
        })
    } catch (error) {
        console.log(error);
    }


}

module.exports = connectToMongo;
