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
      const sort = req.query.sort ? req.query.sort : 'DESC'
      let products = await Product.findAndCountAll({
        raw: true,
        nest: true,
        offset: PAGE_OFFSET,
        limit: PAGE_LIMIT,
        include: [Category],
        order: [['price', sort]],
      })

      if (req.user) {
        var productData = products.rows.map(p => ({
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
      // category
      const categories = await Category.findAll({
        raw:true,
        where:{status:1},
        attributes:['id','name']
      })

      products = productData ? productData : products.rows

      return res.render('products', {
        products,
        cart,
        totalPrice,
        categories,
        page: page,
        totalPage: totalPage,
        prev: prev,
        next: next,
      })
    } catch (err) {
      console.log(err)
      return res.render('error',{err:'產品頁面錯誤'})
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
  searchProduct: async (req, res) => {
    try {
      const search = req.query.search

      let products = await Product.findAll({
        order: [['price', 'ASC']],
        raw: true,
        nest: true,
        include: Category
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
      return res.render('error',{err:'搜尋產品出現錯誤'})
    }
  },
  sortProducts: async (req, res) => {
    try {
      let search = req.query.search
      let searchsort = req.query.searchsort
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
      return res.render('error',{err:'排序產品出現錯誤'})
    }
  }
}

module.exports = ProductController