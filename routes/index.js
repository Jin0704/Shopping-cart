const shopController = require('../controllers/shopController')
const ProductController = require('../controllers/productsController')
const cartController = require('../controllers/cartController')
const orderController = require('../controllers/orderController')
const userController = require('../controllers/userController')

module.exports = (app, passport) => {

  app.get('/', shopController.getshop)
  app.get('/products', ProductController.getProducts)
  app.get('/cart', cartController.getCart)
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

  app.get('/orders', orderController.getOrders)
  app.post('/order', orderController.postOrder)
  app.post('/order/:id/cancel', orderController.cancelOrder)

  app.get('/order/:id/payment', orderController.getPayment)
  app.post('/spgateway/callback', orderController.spgatewayCallback)


}