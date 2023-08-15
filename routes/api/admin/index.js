const express = require('express')
const router = express.Router()
const products = require('./products')
const orders = require('./order')
const categories = require('./category')  
const { authenticated, authenticatedAdmin } = require('../../../middleware/api-auth')

router.use(authenticated)
router.use(authenticatedAdmin)

router.use('/products',products)
router.use('/orders',orders)
router.use('/categories',categories)

module.exports = router