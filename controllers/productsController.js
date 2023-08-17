const db = require('../models')
const User = db.User
const Product = db.Product
const Cart = db.Cart
const Category = db.Category
const PAGE_LIMIT = 6
const redis = require('../redis')

let ProductController = {
  getProducts: async (req, res) => {
    try {
      let data;
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
      data = await redis.getKey('products')
      if(data){
        console.log('=products from Redis=')
        return res.render('products', {
          ...data,
          cart,
          totalPrice,
          categories
        })
      }
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

      // let cart = await Cart.findByPk(req.session.cartId, {
      //   include: 'items'
      // })
      // //sidebar page
      // cart = cart ? cart.toJSON() : { items: [] }
      // let totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
      products = productData ? productData : products.rows


      data ={
        products,
        categories,
        page: page,
        totalPage: totalPage,
        prev: prev,
        next: next,
      }
      await redis.setKey('products',JSON.stringify(data))
      return res.render('products', {
        ...data,
        cart,
        totalPrice,
        categories
      })
    } catch (err) {
      console.log(err)
    }
  },

  getProduct: async (req, res) => {
    try {
      let data;
      let cart = await Cart.findByPk(req.session.cartId, { include: 'items' })
      //sidebar page
      cart = cart ? cart.toJSON() : { items: [] }
      let totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
      data = await redis.getKey(`product-${req.params.id}`)
      if(data){
        console.log('==product data from redis===')
        return res.render('product',{
          ...data,
          cart,
          totalPrice
        })
      }
      const product = await Product.findByPk(req.params.id, { include: [{ model: User, as: 'FavoritedUsers' }, { model: Category }] })

      // const isFavorited = product.FavoritedUsers.map(d => d.id).includes(req.user.id)
      if (req.user) {
        var isFavorited = product.FavoritedUsers.map(d => d.id).includes(req.user.id)
      }

      data = {
        product: product.toJSON(),
        cart: cart,
        totalPrice: totalPrice,
        isFavorited: isFavorited
      }
      await redis.setKey(`product-${req.params.id}`,JSON.stringify(data))
      return res.render('product', {
        ...data
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