const shopController = require('../controllers/shopController')
const ProductController = require('../controllers/productsController')
const cartController = require('../controllers/cartController')
const orderController = require('../controllers/orderController')

module.exports = (app) => {

  app.get('/', shopController.getshop)
  app.get('/products', ProductController.getProducts)
  app.get('/cart', cartController.getCart)
  app.post('/cart', cartController.postCart)


  app.post('/cartItem/:id/add', cartController.addCartitem)
  app.post('/cartItem/:id/sub', cartController.subCartItem)
  app.delete("/cartItem/:id", cartController.deleteCartItem)

  app.get('/orders', orderController.getOrders)
  app.post('/order', orderController.postOrder)
  app.post('/orders/:id/cancel', orderController.cancelOrder)

}