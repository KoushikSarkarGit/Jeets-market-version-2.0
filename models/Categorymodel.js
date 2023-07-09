const mongoose = require('mongoose')
const { Schema } = mongoose;

//creating schema
const newcategory = new Schema({

    categoryname: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        lowercase: true
    }
}, { timestamps: true });

//creating model
const Categorymodel = mongoose.model('category', newcategory);

module.exports = Categorymodel;