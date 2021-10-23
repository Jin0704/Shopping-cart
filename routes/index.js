const shopController = require('../controllers/shopController')
const ProductController = require('../controllers/productsController')
const cartController = require('../controllers/cartController')
const orderController = require('../controllers/orderController')
const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

module.exports = (app, passport) => {

  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/signin')
  }
  const authenticatedAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.isAdmin) { return next() } return res.redirect('/')
    }
    res.redirect('/signin')
  }


  app.get('/', shopController.getshop)
  app.get('/products', ProductController.getProducts)
  app.get('/products/:id', ProductController.getProduct)
  app.get('/cart', authenticated, cartController.getCart)
  app.post('/cart', cartController.postCart)

  app.get('/signin', userController.getSigninPage)
  app.get('/signup', userController.getSignUpPage)
  app.post('/signup', userController.SignUp)
  app.post('/signin', passport.authenticate('local', {
    failureRedirect: '/signin', failureFlash: true
  }), userController.Signin)
  app.get('/logout', userController.logout)

  app.post('/cartItem/:id/add', cartController.addCartitem)
  app.post('/cartItem/:id/sub', cartController.subCartItem)
  app.delete("/cartItem/:id", cartController.deleteCartItem)

  app.get('/orders', authenticated, orderController.getOrders)
  app.post('/order', orderController.postOrder)
  app.post('/order/:id/cancel', authenticated, orderController.cancelOrder)

  app.get('/order/:id/payment', authenticated, orderController.getPayment)
  app.post('/spgateway/callback', authenticated, orderController.spgatewayCallback)

  //Admin routes
  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/products'))
  //Products
  app.get('/admin/products', authenticatedAdmin, adminController.getProducts)
  app.get('/admin/products/create', authenticatedAdmin, adminController.createProducts)
  app.post('/admin/products', authenticatedAdmin, upload.single('image'), adminController.postProdcuts)
  app.get('/admin/products/:id', authenticatedAdmin, adminController.getProduct)
  app.get('/admin/products/:id/edit', authenticatedAdmin, adminController.editProduct)
  app.put('/admin/products/:id', authenticatedAdmin, upload.single('image'), adminController.putProduct)
  app.delete('/admin/products/:id', authenticatedAdmin, adminController.deleteProduct)
  //Orders
  app.get('/admin/orders', authenticatedAdmin, adminController.getOrders)
  app.get('/admin/orders/:id', authenticatedAdmin, adminController.getOrder)
  app.put('/admin/orders/:id', authenticatedAdmin, adminController.putOrder)
}