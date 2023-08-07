const express = require('express')
const router = express.Router()
const product = require('./product')
const user = require('./user')
const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth')


router.use('/', user)
// router.use(authenticated);
router.use('/products', product)


module.exports = router