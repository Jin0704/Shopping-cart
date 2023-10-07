const express = require('express')
const router = express.Router()
const product = require('./product')
const user = require('./user')
const cart = require('./cart')
const order = require('./order')
const category = require('./category')
const paymentMethods  = require('./paymentmethod')
const promotionCode = require('./promotionCode')
// admin
const admin = require('./admin/index')

router.get('/alive',(req,res)=>{
  return res.send('Alive!')
})
router.use('/admin',admin)
router.use('/orders',order)
router.use('/products', product)
router.use('/cart',cart)
router.use('/categories',category)
router.use('/paymentMethods',paymentMethods)
router.use('/promotionCodes',promotionCode)
router.use('/', user)

module.exports = router