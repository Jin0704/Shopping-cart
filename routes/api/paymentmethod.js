const express = require('express')
const router = express.Router()
const PaymentMethodController = require('../../controllers/api/PaymentMethod')

router.get('/', PaymentMethodController.getPaymentMethods)

module.exports = router