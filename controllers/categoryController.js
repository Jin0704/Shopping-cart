const db = require('../models')
const Product = db.Product
const Cart = db.Cart
const Category = db.Category
const PAGE_LIMIT = 6
const redis = require('../redis')

const categoryController = {
  getCategory:async(req,res)=>{
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
        where:{'status':true},
        attributes:['id','name']
      })
    
      const categoryId = req.params.id
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
        where:{CategoryId:categoryId},
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

      products = productData ? productData : products.rows

      data = {
        products,
        cart,
        categories,
        totalPrice,
        page: page,
        totalPage: totalPage,
        prev: prev,
        next: next,
        categoryId:req.params.id
      }
      
      return res.render('category', {
        ...data,
        categories,
        cart,
        totalPrice
      })
    } catch (err) {
      console.log(err)
      return res.render('error',{err:'分類產品頁面錯誤'})
    }
  }
}

module.exports = categoryController