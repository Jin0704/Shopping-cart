const db = require('../models')
const Product = db.Product
const Cart = db.Cart
const Category = db.Category
const PAGE_LIMIT = 6
const redis = require('../redis')
const CartService = require('../services/cart')
const CategoryService = require('../services/category')
const CommonService = require('../services/common')

const categoryController = {
  getCategory:async(req,res)=>{
    try {
      let data={};
      data['cart'] = await CartService.getCart(req)
      data['totalPrice'] = await CartService.computeTotalPrice(data['cart'])
      data['categories'] = await CategoryService.getCategories()
      const categoryId = req.params.id
      let PAGE_OFFSET = 0
      if (req.query.page) {
        PAGE_OFFSET = (req.query.page - 1) * PAGE_LIMIT
      }
      const sort = req.query.sort=='ASC' ? 'ASC':"DESC"
      let products = await Product.findAndCountAll({
        raw: true,
        nest: true,
        offset: PAGE_OFFSET,
        limit: PAGE_LIMIT,
        include: [Category],
        where:{CategoryId:categoryId},
        order: [['price', sort]],
      })

      data['products'] = req.user ? products.rows.map(p => ({
          ...p,
          isFavorited: req.user.FavoritedProducts.map(d => d.id).includes(p.id)
        })): products.rows

      data = await CommonService.calculatePagination(data,products.count,req.query.page)

      return res.render('category', {
        ...data,
        categoryId:req.params.id
      })
    } catch (err) {
      console.log(err)
      return res.render('error',{err:'分類產品頁面錯誤'})
    }
  }
}

module.exports = categoryController