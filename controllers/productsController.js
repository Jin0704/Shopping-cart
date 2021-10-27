const db = require('../models')
const Product = db.Product
const Cart = db.Cart
const PAGE_LIMIT = 6
const PAGE_OFFSET = 0


let ProductController = {
  getProducts: async (req, res) => {
    try {
      const products = await Product.findAndCountAll({
        raw: true,
        nest: true,
        offset: PAGE_OFFSET,
        limit: PAGE_LIMIT
      })

      let cart = await Cart.findByPk(req.session.cartId, {
        include: 'items'
      })
      //sidebar page
      cart = cart ? cart.toJSON() : { items: [] }
      let totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0

      return res.render('products', {
        products,
        cart,
        totalPrice
      })
    } catch (err) {
      console.log(err)
    }
  },

  getProduct: async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id)
      let cart = await Cart.findByPk(req.session.cartId, { include: 'items' })
      //sidebar page
      cart = cart ? cart.toJSON() : { items: [] }
      let totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0

      return res.render('product', {
        product: product.toJSON(),
        cart: cart,
        totalPrice: totalPrice
      })
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = ProductController