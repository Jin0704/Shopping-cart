const express = require('express')
const router = express.Router()
const passport = require('passport')
const shopController = require('../controllers/shopController')
const ProductController = require('../controllers/productsController')
const cartController = require('../controllers/cartController')
const userController = require('../controllers/userController')
const multer = require('multer')
const admin = require('./modules/admin')
const orders = require('./modules/orders')
const auth = require('./modules/auth')
const api = require('./api')
const authenticated = require('../middleware/auth').authenticated

router.use('/admin', admin)
router.use('/orders', orders)
router.use('/auth', auth)
router.use('/api', api)

router.get('/', shopController.getshop)
router.get('/products', ProductController.getProducts)
router.get('/products/:id', ProductController.getProduct)
router.get('/search', ProductController.searchProduct)
router.get('/searchsort', ProductController.sortProducts)
router.post('/cart', cartController.postCart)

router.get('/signin', userController.getSigninPage)
router.get('/signup', userController.getSignUpPage)
router.post('/signup', userController.SignUp)
router.post('/signin', passport.authenticate('local', {
  failureRedirect: '/signin', failureFlash: true
}), userController.Signin)
router.get('/logout', userController.logout)
router.post('/cartItem/:id/add', cartController.addCartitem)
router.post('/cartItem/:id/sub', cartController.subCartItem)
router.delete("/cartItem/:id", cartController.deleteCartItem)


// use authenticated
router.use(authenticated)
router.get('/cart', cartController.getCart)
//favorite routes
router.get('/favorites', userController.getFavoritespage)
router.post('/favorite/:productId', userController.addFavorite)
router.delete('/favorite/:productId', userController.removeFavorite)



module.exports = router