const express = require('express');
// const connectToMongo = require('./database/db');
const morgan = require('morgan');
const authorizationroute = require('./routes/authorizationrout')
const app = express();
const cors = require('cors')
const categoryRoute = require('./routes/categoryRoute')
const productroute = require('./routes/productroute')
const orderRoute = require('./routes/orderRoute')
const { fileURLToPath } = require('url')
const path = require('path')
require('dotenv').config()
const mongouri = process.env.mongo_uri
const mongoose = require('mongoose');


const port = 9000


//middlewares
app.use(express.json());
app.use(cors());
// app.use(morgan)

// routes
app.use('/api/v1', authorizationroute);
app.use('/api/v1/category', categoryRoute);
app.use('/api/v1/product', productroute);
app.use('/api/v1/orders', orderRoute);

//deployment code

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.__dirname(__filename);
app.use(express.static(path.join(__dirname, './frontend/build')))

app.use('*', function (req, res) {
    res.sendFile(path.join(__dirname, './frontend/build/index.html'))
})



app.get("/", (req, res) => {
    res.send('Namoskar');
})




const connectToDB = async () => {

    try {
        await mongoose.connect(mongouri);
        console.log('connected to ecommerce app database')


    } catch (error) {
        console.log(error);
    }

}




connectToDB().then(() => {

    app.listen(9000, () => {
        console.log(`running ecommerce server on port no ${port}`);
    })

})





