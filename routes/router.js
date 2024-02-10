const express = require('express');
const router = express.Router()
const {payment,paymentVerification} = require('../controller/payment')
const {failedmail} = require('../app')

router.post('/payment',payment)
router.post('/payment/paymentverification',paymentVerification)
router.post('/sendmail',failedmail)

module.exports = router  