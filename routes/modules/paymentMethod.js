const db = require('../../models')
const express = require('express')
const router = express.Router()
const PaymentMethodController = require('../../controllers/admin/paymentMethod')
const PaymentMethodService = require('../../services/admin/paymentMethod')
const paymentMethodService = new PaymentMethodService(db)
const paymentMethodController = new PaymentMethodController(paymentMethodService)

router.get('/',paymentMethodController.findAll)
router.post('/',paymentMethodController.store)
router.get('/create',paymentMethodController.create)
router.get('/:id',paymentMethodController.findOne)
router.put('/:id',paymentMethodController.update)
router.delete('/:id',paymentMethodController.delete)

module.exports = router