const db = require('../models')
const Product = db.Product
const User = db.User
const Cart = db.Cart
const PAGE_LIMIT = 6

const ProductService = {
  getProducts: async (req, res) => {
    try {
      const PAGE_OFFSET = req.query.page ? (req.query.page - 1) * PAGE_LIMIT : 0
      const products = await Product.findAndCountAll({
        raw: true,
        nest: true,
        offset: PAGE_OFFSET,
        limit: PAGE_LIMIT
      })

      const page = Number(req.query.page) || 1
      const pages = Math.ceil(products.count / PAGE_LIMIT)
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1

      return {
        products,
        page,
        pages,
        totalPage,
        prev,
        next
      }
    } catch (err) {
      console.error(err)
      throw new Error(err)
    }
  },

  getProduct: async (req, res) => {
    try {
      const id = req.params.id
      const product = await Product.findByPk(id, { include: { model: User, as: 'FavoritedUsers' } })
      // // sidebar page
      // let cart = await Cart.findByPk(req.session.cartId, { include: 'items' })
      // cart = cart ? cart.toJSON() : { items: [] }
      // let totalPrice = cart.items.length ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
      // // const isFavorited = product.FavoritedUsers.map(d => d.id).includes(req.user.id)
      // if (req.user) {
      //   var isFavorited = product.FavoritedUsers.map(d => d.id).includes(req.user.id)
      // }
      // console.log(product)
      // console.log('*************')
      // console.log(isFavorited)
      return { product }
    } catch (err) {
      console.error(err)
      throw new Error(err)
    }
  }
}




module.exports = ProductService