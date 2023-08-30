const db = require('../models')
const Sequelize = db.Sequelize
const User = db.User
const Product = db.Product
const Cart = db.Cart
const Category = db.Category
const CartService = require('../services/cart')
const CategoryService = require('../services/category')
const CommonService = require('../services/common')
const PAGE_LIMIT = 6

let ProductController = {
  getProducts: async (req, res) => {
    try {
      let data = {}
      let PAGE_OFFSET = 0
      if (req.query.page) {
        PAGE_OFFSET = (req.query.page - 1) * PAGE_LIMIT
      }
      const keyword = req.query.keyword || ''
      const sort = req.query.sort=='ASC' ? 'ASC':"DESC"
      const products = await Product.findAndCountAll({
        raw: true,
        nest: true,
        offset: PAGE_OFFSET,
        limit: PAGE_LIMIT,
        where:{
          name:{[Sequelize.Op.like]:`%${keyword}%`}
        },
        include: [Category],
        order: [['price', sort]],
      })

      data['products'] = req.user ? products.rows.map(p => ({
          ...p,
          isFavorited: req.user.FavoritedProducts.map(d => d.id).includes(p.id)
        })): products.rows

      data = await CommonService.calculatePagination(data,products.count,req.query.page)
      data['cart'] = await CartService.getCart(req)
      data['totalPrice'] = await CartService.computeTotalPrice(data['cart'])
      data['categories'] = await CategoryService.getCategories()

      return res.render('products', {
        ...data,
        keyword,
        sort
      })
    } catch (err) {
      console.log(err)
      return res.render('error',{err:'產品頁面錯誤'})
    }
  },

  getProduct: async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id, { include: [{ model: User, as: 'FavoritedUsers' }, { model: Category }] })
      // cart
        let cart = await Cart.findByPk(req.session.cartId, { include: 'items' })
        //sidebar page
        cart = cart ? cart.toJSON() : { items: [] }
        let totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
      // const isFavorited = product.FavoritedUsers.map(d => d.id).includes(req.user.id)
      if (req.user) {
        var isFavorited = product.FavoritedUsers.map(d => d.id).includes(req.user.id)
      }

      return res.render('product', {
        product: product.toJSON(),
        cart: cart,
        totalPrice: totalPrice,
        isFavorited: isFavorited
      })
    } catch (err) {
      console.log(err)
      return res.render('error',{err:'產品頁面錯誤'})
    }
  },
}

module.exports = ProductController