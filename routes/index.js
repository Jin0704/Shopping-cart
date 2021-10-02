const shopController = require('../controllers/shopController')
const ProductController = require('../controllers/productsController')
const cartController = require('../controllers/cartController')


module.exports = (app) => {

  app.get('/', shopController.getshop)
  app.get('/products', ProductController.getProducts)
  app.get('/cart', cartController.getCart)


}