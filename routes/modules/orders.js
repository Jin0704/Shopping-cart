const express = require('express')
const router = express.Router()
// const passport = require("passport")
const orderController = require('../../controllers/orderController')

const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/signin')
}

router.get('/', authenticated, orderController.getOrders)
router.post('/', authenticated, orderController.postOrder)
router.post('/:id/cancel', authenticated, orderController.cancelOrder)

router.get('/:id/payment', authenticated, orderController.getPayment)
router.post('/spgateway/callback', authenticated, orderController.spgatewayCallback)





module.exports = router