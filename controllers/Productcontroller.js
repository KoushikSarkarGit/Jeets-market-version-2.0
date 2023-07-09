const express = require('express')
const { validationResult } = require('express-validator');
const fs = require('fs')
const slugify = require('slugify');
const Productmodel = require('../models/Productmodel');

const createproduct = async (req, res) => {
    let success = false;
    try {
        let imgdetails = {
            data: '',
            contentType: ''
        }

        let { productname, description, price, category, quantity, shipping, manufacturer } = req.fields;
        const { image } = req.files;

        switch (true) {
            case !productname:
                return res.status(500).send({ error: "productname is Required" });
            case !description:
                return res.status(500).send({ error: "Description is Required" });
            case !price:
                return res.status(500).send({ error: "Price is Required" });
            case !category:
                return res.status(500).send({ error: "Category is Required" });
            case !quantity:
                return res.status(500).send({ error: "Quantity is Required" });
            case image && image.size > 1000000:
                return res
                    .status(500)
                    .send({ error: "Image is Required and should be less then 1mb" });
        }
        if (image) {
            imgdetails.data = fs.readFileSync(image.path)
            imgdetails.contentType = image.type
        }

        const creatingproduct = await Productmodel.create({ ...req.fields, image: imgdetails, slug: slugify(productname) });

        // if (image) {
        //     creatingproduct.image.data = fs.readFileSync(image.path)
        //     creatingproduct.image.contentType = image.type
        // }

        res.status(200).send({ success: true, msg: 'product created successfully', creatingproduct })


    } catch (error) {
        console.log(error);

        res.status(400).json({ success, msg: 'there was some error during the creation of this product ' })

    }
}


const getallproduct = async (req, res) => {
    try {
        const allproducts = await Productmodel.find({}).select('-image').limit(16).sort({ createdAt: -1 }).populate('category')
        res.status(200).send({ success: true, msg: 'fetching products successful', allproducts, totalfetchedproduct: allproducts.length });

    } catch (error) {
        console.log(error);

        res.status(400).json({ success, msg: 'there was some error during the fetching product list ' })

    }
}


const getoneproduct = async (req, res) => {
    try {


        const yourproducts = await Productmodel.findOne({ _id: req.params.pid }).select('-image').populate('category')
        res.status(200).send({ success: true, msg: 'fetching product is successful', yourproducts });

    } catch (error) {
        console.log(error);

        res.status(400).json({ success: false, msg: 'there was some error during the fetching of the product' })

    }
}

const getoneimage = async (req, res) => {

    try {

        const yourproductimage = await Productmodel.findById(req.params.prid).select('image')


        // Pass the imageSrc variable to your frontend to display the image

        if (yourproductimage.image.data) {
            // res.set('contentType', yourproductimage.image.contentType);
            res.contentType(yourproductimage.image.contentType);
            // res.set('Content-Type', 'image/jpeg');
            res.send(yourproductimage.image.data);

        }


    } catch (error) {
        console.log(error);

        res.status(400).json({ success: false, msg: 'there was some error during the fetching the image of the product' })

    }

}


const updateproduct = async (req, res) => {

    try {
        let imgdetails = {
            data: '',
            contentType: ''
        }

        let { productname, description, price, category, quantity, shipping, manufacturer } = req.fields;
        const { image } = req.files;
        console.log(productname, description)


        switch (true) {
            case !productname:
                return res.status(500).send({ error: "productname is Required" });
            case !description:
                return res.status(500).send({ error: "Description is Required" });
            case !price:
                return res.status(500).send({ error: "Price is Required" });
            case !category:
                return res.status(500).send({ error: "Category is Required" });
            case !quantity:
                return res.status(500).send({ error: "Quantity is Required" });
            case image && image.size > 1000000:
                return res
                    .status(500)
                    .send({ error: "Image is Required and should be less then 1mb" });
        }

        if (image) {
            imgdetails.data = fs.readFileSync(image.path)
            imgdetails.contentType = image.type
        }


        const updatingproduct = await Productmodel.findByIdAndUpdate(req.params.id, { ...req.fields, image: imgdetails, slug: slugify(productname) }, { new: true });

        res.status(200).send({ success: true, msg: 'product Updated successfully', updatingproduct })



    } catch (error) {
        console.log(error);

        res.status(400).json({ success: false, msg: 'there was some error during the updation of the product' })

    }

}

const getallproductbycategory = async (req, res) => {
    try {
        let categorypassed = req.params.categoryid;
        const allproducts = await Productmodel.find({ category: categorypassed }).select('-image').limit(16).sort({ createdAt: -1 })
        res.status(200).send({ success: true, msg: 'fetching products successful', allproducts, totalfetchedproduct: allproducts.length, categorypassed });

    } catch (error) {
        console.log(error);

        res.status(400).json({ success: false, msg: 'there was some error during the fetching product list ' })

    }
}




const filteredproduct = async (req, res) => {
    try {
        const { checkedcategory, checkedprice } = req.body;

        const perPage = 6;
        const page = req.params.page ? req.params.page : 1;

        let filterparams = {}

        if (checkedcategory.length > 0) { filterparams.category = checkedcategory; }

        if (checkedprice.length) { filterparams.price = { $gte: checkedprice[0], $lte: checkedprice[1] } }

        const totalproducts = await Productmodel.find(filterparams).countDocuments(filterparams)
        const allproducts = await Productmodel.find(filterparams).select('-image').skip((page - 1) * perPage).limit(perPage).sort({ createdAt: -1 })
        res.status(200).send({ success: true, msg: 'fetching products successful', filterparams, allproducts, totalfetchedproduct: totalproducts });

    } catch (error) {
        console.log(error);

        res.status(400).json({ success: false, msg: 'there was some error during the fetching product list ' })

    }
}



const productcount = async (req, res) => {
    try {


        const totalproducts = await Productmodel.find().estimatedDocumentCount()

        res.status(400).send({ success: true, msg: 'fetching product total number successful', totalproducts });

    } catch (error) {
        console.log(error);

        res.status(400).json({ success: false, msg: 'there was some error in productcount ' })

    }
}


const productsbypage = async (req, res) => {
    try {

        const perPage = 6;
        const page = req.params.page ? req.params.page : 1;
        const totalproducts = await Productmodel.find().estimatedDocumentCount()
        const limitedproducts = await Productmodel.find({}).select('-image').skip((page - 1) * perPage).limit(perPage).sort({ createdAt: -1 })


        res.status(200).send({ success: true, msg: 'fetching products successful', limitedproducts, totalfetchedproduct: totalproducts });

    } catch (error) {
        console.log(error);

        res.status(400).json({ success: false, msg: 'there was some error in productsbypage ' })

    }
}


const searchproduct = async (req, res) => {
    try {


        const { keyword } = req.params;
        const searchresutls = await Productmodel
            .find({
                $or: [
                    { productname: { $regex: keyword, $options: "i" } },
                    { description: { $regex: keyword, $options: "i" } },
                ],
            })
            .select("-image").sort({ createdAt: -1 });

        const totalproducts = await Productmodel.find({
            $or: [
                { productname: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ],
        }).countDocuments()



        res.status(200).send({ success: true, msg: 'fetching products successful', searchresutls, totalfetchedproduct: totalproducts });

    } catch (error) {
        console.log(error);

        res.status(400).json({ success: false, msg: 'there was some error during the fetching product list in searchbar ' })

    }
}

const getrelateditems = async (req, res) => {
    try {


        const { pid, cid } = req.params;
        const relateditems = await Productmodel
            .find({
                category: cid,
                _id: { $ne: pid }
            })
            .select("-image").limit(8).populate('category').sort({ createdAt: -1 });





        res.status(200).send({ success: true, msg: 'fetching products successful', relateditems });

    } catch (error) {
        console.log(error);

        res.status(400).json({ success: false, msg: 'there was some error during the fetching product list in getrelateditems ' })

    }
}




const deleteproduct = async (req, res) => {
    try {
        let passedid = req.params.id;
        const allproducts = await Productmodel.findByIdAndDelete(passedid)
        res.status(200).send({ success: true, msg: 'Product deleted Successfully', allproducts });

    } catch (error) {
        console.log(error);

        res.status(400).json({ success: false, msg: 'there was some error during the feleting of the product ' })

    }
}


module.exports = { createproduct, getallproduct, getoneproduct, updateproduct, getoneimage, getallproductbycategory, deleteproduct, filteredproduct, productcount, productsbypage, searchproduct, getrelateditems }