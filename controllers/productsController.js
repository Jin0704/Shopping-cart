const db = require('../models')
const Product = db.Product
const Cart = db.Cart
const PAGE_LIMIT = 3
const PAGE_OFFSET = 0


let ProductController = {
  getProducts: (req, res) => {
    Product.findAndCountAll({
      raw: true,
      nest: true,
      offset: PAGE_OFFSET,
      limit: PAGE_LIMIT
    }).then(products => {
      //sidebar page
      return Cart.findByPk(req.session.cartId, {
        include: 'items'
      }).then(cart => {
        cart = cart ? cart.toJSON() : { items: [] }
        let totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
        // console.log(products)
        return res.render('products', {
          products,
          cart,
          totalPrice
        })
      })
    })
  },

}



module.exports = ProductController