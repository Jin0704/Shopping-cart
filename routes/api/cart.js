const express = require('express')
const router = express.Router()
const CartController = require('../../controllers/api/CartController')
const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth')

router.use(authenticated)
router.get('/', CartController.getCart)
router.post('/',CartController.postCart)
router.post('/cartItem/:id/add', CartController.addCartItem)
router.post('/cartItem/:id/sub', CartController.subCartItem)
router.delete("/cartItem/:id", CartController.deleteCartItem)

module.exports = router