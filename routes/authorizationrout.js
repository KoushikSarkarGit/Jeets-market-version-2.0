const express = require('express');

const router = express.Router();
const registercontroller = require('../controllers/register');
const logincontroller = require('../controllers/login')
const { body } = require('express-validator');
const tokenchecker = require('../middlewares/tokenchecker')
const Forgetpasswordcontroller = require('../controllers/Forgetpasswordcontroller');
const { getuserdetails, updateuserdetails } = require('../controllers/Userdetailscontroller');
const valtoken = require('../middlewares/tokenchecker');



//signup route

router.post('/register',

    body('email').isEmail(),
    body('name').isLength({ min: 3 }),
    body('password').isLength({ min: 6 }),
    body('phone').isLength({ min: 10 }).isNumeric(),
    body('zipcode').isLength({ min: 6 }),

    registercontroller)

//login route

router.post('/login',

    body('email').isEmail(),
    body('password').isLength({ min: 6 }),

    logincontroller)



// forgot password
router.post('/forgot-password',

    body('email').isEmail(),
    body('newpassword').isLength({ min: 6 }),
    body('answer').isLength({ min: 1 }),

    Forgetpasswordcontroller)


// protected route for user dashboard

router.post('/user-prot-check', tokenchecker, (req, res) => {

    const responded = res.status(200).json({ ok: true })
    // console.log('eser-prot-check triggered');
})

// protected route for admin dashboard

router.post('/admin-prot-check', tokenchecker, (req, res) => {

    const responded = res.status(200).json({ ok: true, msg: 'admin dashboard' })
    // console.log('eser-prot-check triggered');
})

router.get('/get-user-details', valtoken, getuserdetails)

// update user details
router.post('/update-user-details', valtoken, updateuserdetails)





module.exports = router;