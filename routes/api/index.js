const express = require('express')
const router = express.Router()
const product = require('./product')
const user = require('./user')
const cart = require('./cart')
const order = require('./order')

// admin
const admin = require('./admin/index')

router.use('/admin',admin)
router.use('/orders',order)
router.use('/products', product)
router.use('/cart',cart)
router.use('/', user)


module.exports = router