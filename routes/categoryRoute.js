const express = require('express');
// const tokenchecker = require('../middlewares/tokenchecker')
const { body } = require('express-validator');
const { isAdmin } = require('../middlewares/registrationchecker')
const valtoken = require('../middlewares/tokenchecker');
const { createcategory, getallcategoris, updatecategory, deletecategory } = require('../controllers/Categorycontroller');


const router = express.Router();

// route for creating a new category
router.post('/create-new-category', body('categoryname').isLength({ min: 1 }), valtoken, isAdmin, createcategory)

// route for getting all categoris

router.get('/get-all-categories', getallcategoris)

// udate category

router.put('/update-category/:id', body('newcategoryname').isLength({ min: 1 }), valtoken, isAdmin, updatecategory)

//
router.delete('/delete-category/:id', valtoken, isAdmin, deletecategory)





module.exports = router;