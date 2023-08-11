const express = require('express')
const router = express.Router()
const products = require('./products')
const { authenticated, authenticatedAdmin } = require('../../../middleware/api-auth')

router.use(authenticated)
router.use(authenticatedAdmin)

router.use('/products',products)

module.exports = router