const express = require('express')
const router = express.Router()
const categoryController = require('../../controllers/api/CategoryController')
router.get('/', categoryController.getCategories)

module.exports = router