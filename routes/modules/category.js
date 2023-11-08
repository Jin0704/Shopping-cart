const express = require('express')
const router = express.Router()
const CategoryController = require('../../controllers/admin/category')
const CategoryService = require('../../services/admin/category')
const db = require('../../models')

const categoryService = new CategoryService(db)
const categoryController = new CategoryController(categoryService)

router.get('/', categoryController.findAll)
router.post('/',categoryController.store)
router.get('/create',categoryController.create)
router.get('/:id', categoryController.findOne)
router.put('/:id',categoryController.edit)
router.delete('/:id',categoryController.delete)

module.exports = router