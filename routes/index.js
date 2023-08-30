const express = require('express')
const router = express.Router()
const passport = require('passport')
const shopController = require('../controllers/shopController')
const productController = require('../controllers/productsController')
const cartController = require('../controllers/cartController')
const userController = require('../controllers/userController')
const categoryController = require('../controllers/categoryController') 
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
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
router.get('/categories/:id',categoryController.getCategory)
router.get('/products', productController.getProducts)
router.get('/products/:id', productController.getProduct)
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

// private
router.get('/private',(req,res)=>{
  res.render('private')
})
// terms
router.get('/terms',(req,res)=>{
  res.render('terms')
})

// use authenticated
router.use(authenticated)
// user
router.get('/users/:id/profile', userController.getUser)
router.get('/users/:id/orders', userController.getOrders)
router.get('/users/:id/favorited', userController.getUserFavorites)
router.put('/users/:id', upload.single('image'), userController.editUser)

router.get('/cart', cartController.getCart)
//favorite routes
router.get('/favorites', userController.getFavoritespage)
router.post('/favorites/:productId', userController.addFavorite)
router.delete('/favorites/:productId', userController.removeFavorite)



module.exports = router