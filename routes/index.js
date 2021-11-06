const express = require('express')
const router = express.Router()
const passport = require('passport')
const shopController = require('../controllers/shopController')
const ProductController = require('../controllers/productsController')
const cartController = require('../controllers/cartController')
const userController = require('../controllers/userController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const admin = require('./modules/admin')
const orders = require('./modules/orders')
const auth = require('./modules/auth')

router.use('/admin', admin)
router.use('/orders', orders)
router.use('/auth', auth)


const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/signin')
}


router.get('/', shopController.getshop)
router.get('/products', ProductController.getProducts)
router.get('/products/:id', ProductController.getProduct)
router.get('/cart', authenticated, cartController.getCart)
router.post('/cart', cartController.postCart)

router.get('/signin', userController.getSigninPage)
router.get('/signup', userController.getSignUpPage)
router.post('/signup', userController.SignUp)
router.post('/signin', passport.authenticate('local', {
  failureRedirect: '/signin', failureFlash: true
}), userController.Signin)
router.get('/logout', userController.logout)

//favorite routes
router.get('/favorites', authenticated, userController.getFavoritespage)
router.post('/favorite/:productId', authenticated, userController.addFavorite)
router.delete('/favorite/:productId', authenticated, userController.removeFavorite)

router.post('/cartItem/:id/add', cartController.addCartitem)
router.post('/cartItem/:id/sub', cartController.subCartItem)
router.delete("/cartItem/:id", cartController.deleteCartItem)


module.exports = router