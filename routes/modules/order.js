const express = require('express')
const router = express.Router()
const db = require('../../models')
const OrderController = require('../../controllers/admin/order')
const OrderService = require('../../services/admin/order')
const orderService = new OrderService(db)
const orderController = new OrderController(orderService)

router.get('/', orderController.findAll)
router.get('/:id', orderController.findOne)
router.put('/:id', orderController.update)
router.delete('/:id', orderController.delete)

module.exports = router