const express = require('express');

const { isAdmin, requireSignIn } = require('../middlewares/registrationchecker')
const valtoken = require('../middlewares/tokenchecker');

// const formidable = require('express-formidable');
const { getorderbycustomerid, getllOrders, changeOrderStatus } = require('../controllers/Ordercontroller');

const router = express.Router();

router.get("/get-orders-from-buyer", valtoken, requireSignIn, getorderbycustomerid);

router.get("/get-all-orders-for-admin", isAdmin, getllOrders);

// order status update from admin
router.put("/order-status/:orderId", requireSignIn, changeOrderStatus);

module.exports = router;