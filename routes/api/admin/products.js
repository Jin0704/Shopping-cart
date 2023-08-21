const express = require('express')
const router = express.Router()
const ProductController = require('../../../controllers/api/admin/product')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

router.get('/',ProductController.getProducts)
router.get('/:id',ProductController.getProduct)
router.post('/',upload.single('image'),ProductController.postProduct)
router.put('/:id',ProductController.putProduct)
router.delete('/:id',ProductController.deleteProduct)

module.exports = router