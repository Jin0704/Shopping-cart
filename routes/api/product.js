const express = require('express')
const router = express.Router()
const ProductsController = require('../../controllers/api/ProductsController')

router.get('/', ProductsController.getProducts)
router.get('/:id', ProductsController.getProduct)

module.exports = router