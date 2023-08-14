const db = require('../models')
const User = db.User
const Product = db.Product
const Cart = db.Cart
const Category = db.Category
const PAGE_LIMIT = 6


let ProductController = {
  getProducts: async (req, res) => {
    try {
      let PAGE_OFFSET = 0
      if (req.query.page) {
        PAGE_OFFSET = (req.query.page - 1) * PAGE_LIMIT
      }

      let products = await Product.findAndCountAll({
        raw: true,
        nest: true,
        offset: PAGE_OFFSET,
        limit: PAGE_LIMIT,
        include: [Category]
      })

      if (req.user) {
        var data = products.rows.map(p => ({
          ...p,
          isFavorited: req.user.FavoritedProducts.map(d => d.id).includes(p.id)
        }))
      }

      const page = Number(req.query.page) || 1
      const pages = Math.ceil(products.count / PAGE_LIMIT)
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1


      let cart = await Cart.findByPk(req.session.cartId, {
        include: 'items'
      })
      //sidebar page
      cart = cart ? cart.toJSON() : { items: [] }
      let totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
      products = data ? data : products.rows
      // console.log(req.user)
      // console.log('****************')
      // console.log(products)
      // console.log('****************')
      // console.log(data)
      // console.log(products[0])

      const categories = await Category.findAll({
        raw:true,
        where:{status:1},
        attributes:['id','name']
      })

      return res.render('products', {
        products,
        cart,
        categories,
        totalPrice,
        page: page,
        totalPage: totalPage,
        prev: prev,
        next: next,
      })
    } catch (err) {
      console.log(err)
    }
  },

  getProduct: async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id, { include: [{ model: User, as: 'FavoritedUsers' }, { model: Category }] })
      let cart = await Cart.findByPk(req.session.cartId, { include: 'items' })
      //sidebar page
      cart = cart ? cart.toJSON() : { items: [] }
      let totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
      // const isFavorited = product.FavoritedUsers.map(d => d.id).includes(req.user.id)
      if (req.user) {
        var isFavorited = product.FavoritedUsers.map(d => d.id).includes(req.user.id)
      }
      // console.log(product)
      // console.log('*************')
      // console.log(isFavorited)
      return res.render('product', {
        product: product.toJSON(),
        cart: cart,
        totalPrice: totalPrice,
        isFavorited: isFavorited
      })
    } catch (err) {
      console.log(err)
    }
  },
  searchProduct: async (req, res) => {
    try {
      const search = req.query.search

      let products = await Product.findAll({
        order: [['price', 'ASC']],
        raw: true,
        nest: true,
      })

      if (req.user) {
        var data = products.map(p => ({
          ...p,
          isFavorited: req.user.FavoritedProducts.map(d => d.id).includes(p.id)
        }))
      }

      let cart = await Cart.findByPk(req.session.cartId, {
        include: 'items'
      })
      //sidebar page
      cart = cart ? cart.toJSON() : { items: [] }
      let totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
      products = data ? data : products
      // fliter search items
      let searchProducts = products.filter(product => product.name.toUpperCase().includes(search.toUpperCase()))

      return res.render('search', {
        products: searchProducts,
        cart,
        totalPrice,
        search
      })
    } catch (err) {
      console.log(err)
    }
  },
  sortProducts: async (req, res) => {
    try {
      let search = req.query.search
      let searchsort = await req.query.searchsort
      searchsort = searchsort ? searchsort : 'ASC'

      let products = await Product.findAll({
        order: [['price', `${searchsort}`]],
        raw: true,
        nest: true
      })
      if (req.user) {
        var data = products.map(p => ({
          ...p,
          isFavorited: req.user.FavoritedProducts.map(d => d.id).includes(p.id)
        }))
      }

      let cart = await Cart.findByPk(req.session.cartId, {
        include: 'items'
      })
      //sidebar page
      cart = cart ? cart.toJSON() : { items: [] }
      let totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
      products = data ? data : products
      let searchProducts = products.filter(product => product.name.toUpperCase().includes(search.toUpperCase()))

      return res.render('search', {
        products: searchProducts,
        cart,
        totalPrice,
        search
      })
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = ProductController