const express = require('express')
const router = express.Router()
const CategoryController = require('../../../controllers/api/admin/category')

router.get('/', CategoryController.getCategories)
router.get('/:id',CategoryController.getCategory)
router.post('/',CategoryController.createCategory)
router.put('/:id/status',CategoryController.editCategoryStatus)
router.put('/:id',CategoryController.editCategory)
router.delete('/:id',CategoryController.deleteCategory)

module.exports = router