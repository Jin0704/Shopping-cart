const express = require('express')
const router = express.Router()
// const passport = require("passport")
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const adminController = require('../../controllers/adminController')

const authenticatedAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) { return next() } return res.redirect('/')
  }
  res.redirect('/signin')
}

//Admin routes
router.get('/', authenticatedAdmin, (req, res) => res.redirect('/admin/products'))
//Products
router.get('/products', authenticatedAdmin, adminController.getProducts)
router.get('/products/create', authenticatedAdmin, adminController.createProducts)
router.post('/products', authenticatedAdmin, upload.single('image'), adminController.postProdcuts)
router.get('/products/:id', authenticatedAdmin, adminController.getProduct)
router.get('/products/:id/edit', authenticatedAdmin, adminController.editProduct)
router.put('/products/:id', authenticatedAdmin, upload.single('image'), adminController.putProduct)
router.delete('/products/:id', authenticatedAdmin, adminController.deleteProduct)
//Orders
router.get('/orders', authenticatedAdmin, adminController.getOrders)
router.get('/orders/:id', authenticatedAdmin, adminController.getOrder)
router.put('/orders/:id', authenticatedAdmin, adminController.putOrder)
router.delete('/orders/:id', authenticatedAdmin, adminController.deleteOrder)



module.exports = router