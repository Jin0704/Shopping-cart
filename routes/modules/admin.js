const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const ProductController = require('../../controllers/admin/product')
const OrderController = require('../../controllers/admin/order')
const CategoryController = require('../../controllers/admin/category')
const PaymentMethodController = require('../../controllers/admin/paymentMethod')
const promotionCode = require('./promotionCode')
const user = require('./user')
const setting = require('./setting')
const authenticatedAdmin = require('../../middleware/auth').authenticatedAdmin

router.use(authenticatedAdmin)
//Admin routes
router.get('/', (req, res) => res.redirect('/admin/products'))
//Products
router.get('/products', ProductController.getProducts)
router.get('/products/create', ProductController.createProducts)
router.post('/products', upload.single('image'), ProductController.postProducts)
router.get('/products/:id', ProductController.getProduct)
router.get('/products/:id/edit', ProductController.editProduct)
router.put('/products/:id', upload.single('image'), ProductController.putProduct)
router.delete('/products/:id', ProductController.deleteProduct)
//Orders
router.get('/orders', OrderController.getOrders)
router.get('/orders/:id', OrderController.getOrder)
router.put('/orders/:id', OrderController.putOrder)
router.delete('/orders/:id', OrderController.deleteOrder)
// categories
router.get('/categories',CategoryController.getCategories)
router.get('/categories/create', CategoryController.createCategory)
router.post('/categories',CategoryController.postCategory)
router.get('/categories/:id', CategoryController.getCategory)
router.put('/categories/:id', CategoryController.editCategory)
router.delete('/categories/:id', CategoryController.deleteCategory)
//paymentMethods
router.get('/paymentMethods', PaymentMethodController.getPaymentMethods)
router.post('/paymentMethods',PaymentMethodController.postPaymentMethod)
router.get('/paymentMethods/create', PaymentMethodController.createPaymentMethod)
router.get('/paymentMethods/:id', PaymentMethodController.getPaymentMethod)
router.put('/paymentMethods/:id', PaymentMethodController.editPaymentMethod)
router.delete('/paymentMethods/:id', PaymentMethodController.deletePaymentMethod)

router.use('/promotionCodes',promotionCode)
router.use('/users',user)
router.use('/settings', setting)


module.exports = router