const express = require('express')
const router = express.Router()
const OrderController = require('../../../controllers/api/admin/order')

router.get('/', OrderController.getOrders)
router.get('/:id',OrderController.getOrder)
router.put('/:id',OrderController.putOrder)
router.delete('/:id',OrderController.deleteOrder)

module.exports = router