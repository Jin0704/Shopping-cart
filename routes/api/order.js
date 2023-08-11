const express =require('express')
const router = express.Router()
const OrderController = require('../../controllers/api/OrderController')
const { authenticated } = require('../../middleware/api-auth')

router.use(authenticated)
router.get('/',OrderController.getOrders)
router.get('/:id',OrderController.getOrder)
router.post('/',OrderController.postOrder)
router.put('/:id',OrderController.cancelOrder)

module.exports = router