const express = require('express');
const { body } = require('express-validator');
const { isAdmin, requireSignIn } = require('../middlewares/registrationchecker')
const valtoken = require('../middlewares/tokenchecker');
const { createproduct, getallproduct, getoneproduct, updateproduct, getoneimage, getallproductbycategory, deleteproduct, filteredproduct, productsbypage, productcount, searchproduct, getrelateditems } = require('../controllers/Productcontroller');
const formidable = require('express-formidable');
const { tokengiver, finalpayment } = require('../controllers/Ordercontroller');

const router = express.Router();


// create product route
router.post('/create-product', valtoken, isAdmin, formidable(), createproduct)

// get all products
router.get('/get-all-product', getallproduct)

// get all products by category
router.get('/get-all-product-by-category/:categoryid', getallproductbycategory)

// get single products
router.get('/get-one-product/:pid', getoneproduct)

// get single products image
router.get('/product-image/:prid', getoneimage)

// PUT single products
router.put('/update-product/:id', valtoken, formidable(), isAdmin, updateproduct)

// get products by filter
router.post('/filter-product/:page', filteredproduct)

// count total product
router.get('/product-count', productcount)

// get products by pagenumber
// router.post('/get-products-by-page/:page', productsbypage)
router.get('/get-products-by-page/:page', productsbypage)

// get products by search
router.get('/get-products-by-search/:keyword', searchproduct)

// get related products based on category

router.post('/get-related-products/:pid/:cid', getrelateditems)

// delete single products
router.delete('/delete-product/:id', valtoken, isAdmin, deleteproduct)



//payments related routes


//token
router.get("/braintree/token", tokengiver);

//payments
router.post("/braintree/payment", requireSignIn, finalpayment);








module.exports = router;