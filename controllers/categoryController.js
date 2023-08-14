const db = require('../models')
const User = db.User
const Product = db.Product
const Cart = db.Cart
const Category = db.Category
const PAGE_LIMIT = 6

const categoryController = {
  getCategory:async(req,res)=>{
    try {
      const categoryId = req.params.id
      let PAGE_OFFSET = 0
      if (req.query.page) {
        PAGE_OFFSET = (req.query.page - 1) * PAGE_LIMIT
      }

      let products = await Product.findAndCountAll({
        raw: true,
        nest: true,
        offset: PAGE_OFFSET,
        limit: PAGE_LIMIT,
        include: [Category],
        where:{CategoryId:categoryId}
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
        attributes:['id','name']
      })
      
      return res.render('category', {
        products,
        cart,
        categories,
        totalPrice,
        page: page,
        totalPage: totalPage,
        prev: prev,
        next: next,
        categoryId:req.params.id
      })
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = categoryController