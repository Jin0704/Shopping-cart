const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const adminController = require('../../controllers/adminController')
const authenticatedAdmin = require('../../middleware/auth').authenticatedAdmin

//Admin routes
router.get('/', authenticatedAdmin, (req, res) => res.redirect('/admin/products'))
//Products
router.get('/products', authenticatedAdmin, adminController.getProducts)
router.get('/products/create', authenticatedAdmin, adminController.createProducts)
router.post('/products', authenticatedAdmin, upload.single('image'), adminController.postProducts)
router.get('/products/:id', authenticatedAdmin, adminController.getProduct)
router.get('/products/:id/edit', authenticatedAdmin, adminController.editProduct)
router.put('/products/:id', authenticatedAdmin, upload.single('image'), adminController.putProduct)
router.delete('/products/:id', authenticatedAdmin, adminController.deleteProduct)
//Orders
router.get('/orders', authenticatedAdmin, adminController.getOrders)
router.get('/orders/:id', authenticatedAdmin, adminController.getOrder)
router.put('/orders/:id', authenticatedAdmin, adminController.putOrder)
router.delete('/orders/:id', authenticatedAdmin, adminController.deleteOrder)
// categories
router.get('/categories',authenticatedAdmin,adminController.getCategories)
router.get('/categories/create', authenticatedAdmin, adminController.createCategory)
router.post('/categories',authenticatedAdmin,adminController.postCategory)
router.get('/categories/:id', authenticatedAdmin, adminController.getCategory)
router.put('/categories/:id', authenticatedAdmin, adminController.editCategory)
router.delete('/categories/:id', authenticatedAdmin, adminController.deleteCategory)

module.exports = router