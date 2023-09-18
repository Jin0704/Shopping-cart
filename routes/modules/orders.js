const express = require('express')
const router = express.Router()
const orderController = require('../../controllers/orderController')

const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/signin')
}

router.post('/compute', orderController.checkPromotionCode)
router.get('/', authenticated, orderController.getOrders)
router.post('/', authenticated, orderController.postOrder)
router.post('/:id/cancel', authenticated, orderController.cancelOrder)

router.get('/:id/payment', authenticated, orderController.getPayment)
router.post('/newebpay/callback', orderController.newebpayCallback)


module.exports = router