const express = require('express')
const router = express.Router()
const db = require('../../models')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const ProductController = require('../../controllers/admin/product')
const ProductService =  require('../../services/admin/product')
const productService = new ProductService(db)
const productController = new ProductController(productService)

router.get('/',productController.findAll)
router.get('/create', productController.createPage)
router.post('/',upload.single('image'),productController.store)
router.get('/:id', productController.findOne)
router.get('/:id/edit', productController.edit)
router.put('/:id',upload.single('image'), productController.update)
router.delete('/:id', productController.delete)



module.exports = router