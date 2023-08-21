const express = require('express')
const router = express.Router()
const ProductsController = require('../../controllers/api/ProductsController')
const { authenticateUser } = require('../../middleware/api-auth')
router.use(authenticateUser)
router.get('/', ProductsController.getProducts)
router.get('/:id', ProductsController.getProduct)

module.exports = router