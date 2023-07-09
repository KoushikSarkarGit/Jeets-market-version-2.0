const express = require('express')
const Categorymodel = require('../models/Categorymodel')
const slugify = require('slugify');
const { validationResult } = require('express-validator');


const createcategory = async (req, res) => {
    try {
        // const { categoryname } = req.body
        // console.log(categoryname)
        const existingcategory = await Categorymodel.findOne({ categoryname: req.body.categoryname });

        if (existingcategory) {
            return res.status(200).json({ success: false, msg: 'Category already exist' })
        }


        const createdcategory = await Categorymodel.create({ categoryname: req.body.categoryname, slug: slugify(req.body.categoryname) });

        res.status(200).json({ success: true, msg: 'Category created successfully' })
    } catch (error) {
        // console.log(error)
        res.status(400).json({ success: false, msg: 'some error happened in createcategory controller function' })
    }


}



const getallcategoris = async (req, res) => {
    try {
        const allcategories = await Categorymodel.find({});

        res.status(200).json({ success: true, categorylist: allcategories })

    } catch (error) {
        res.status(400).json({ success: false, msg: 'some error happened fething the categories' })
    }

}

const updatecategory = async (req, res) => {
    try {
        let success = true;
        const valerror = await validationResult(req);
        if (!valerror.isEmpty()) {
            return res.status(400).json({ success, msg: "please fill the form in instructed format", curerr: valerror.array() });
        }

        const { id } = await req.params;
        const categoryname = await req.body.newcategoryname;

        const reqcategory = await Categorymodel.findByIdAndUpdate(id, { categoryname, slug: slugify(categoryname) }, { new: true })

        res.status(200).json({ success: true, msg: 'category updated successfully', reqcategory })


    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, msg: 'some error happened updating the category', error })
    }
}


const deletecategory = async (req, res) => {
    try {
        let success = true;

        const { id } = await req.params;


        const delcategory = await Categorymodel.findByIdAndDelete(id);

        res.status(200).json({ success: true, msg: 'category deleted successfully', delcategory })


    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, msg: 'some error happened deleting the category', error })
    }
}

module.exports = { createcategory, getallcategoris, updatecategory, deletecategory }