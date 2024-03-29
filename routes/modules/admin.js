const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const ProductController = require('../../controllers/admin/product')
const OrderController = require('../../controllers/admin/order')
const promotionCode = require('./promotionCode')
const user = require('./user')
const products = require('./product')
const setting = require('./setting')
const categories = require('./category')
const orders = require('./order')
const paymentMethods = require('./paymentMethod')
const authenticatedAdmin = require('../../middleware/auth').authenticatedAdmin

router.use(authenticatedAdmin)
//Admin routes
router.get('/', (req, res) => res.redirect('/admin/products'))
//Products
router.use('/products',products)
//Orders
router.use('/orders',orders)
// categories
router.use('/categories',categories)
// paymentMethods
router.use('/paymentMethods',paymentMethods)

router.use('/promotionCodes',promotionCode)
router.use('/users',user)
router.use('/settings', setting)


module.exports = router