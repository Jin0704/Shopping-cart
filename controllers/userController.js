const db = require('../models')
const User = db.User
const Favorite = db.Favorite
const Product = db.Product
const Order  = db.Order
const bcrypt = require('bcryptjs')
const yupCheck = require('../helper/yupCheck')
const userController = {

  getSigninPage: (req, res) => {
    return res.render('signin')
  },

  getSignUpPage: (req, res) => {
    return res.render('signup')
  },

  SignUp: async (req, res) => {
    try {
      // console.log(req.body)
      await yupCheck.signUpShape(req.body)
      if (req.body.confirmpassword !== req.body.password) {
        req.flash('error_messages', '兩次密碼輸入不同')
        return res.redirect('/signup')
      }
      const user = await User.findOne({ where: { email: req.body.email } })
      if (user) {
        req.flash('error_messages', '信箱重複')
        return res.redirect('/signup')
      }

      await User.create({
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(6))
      })

      req.flash('success_messages', '註冊成功')
      return res.redirect('/signin')
    } catch (err) {
      console.log(err)
    }
  },

  Signin: (req, res) => {
    req.flash('success_messages', '成功登入')
    return res.redirect('/')
  },

  getUser: async(req,res)=>{
    try{
      const user = await User.findByPk(req.user.id)
      return res.render('user/profile',{user:user.toJSON()})
    }catch(err){
      console.log(err)
      return res.render('error',{err:'個人葉面錯誤'})
    }
  },

  getOrders: async(req,res)=>{
    try{
      const userId = req.user.id
      const user = await User.findByPk(req.user.id)
      let PAGE_OFFSET = 0
      const OrderPagelimit = 10
      if (req.query.page) {
        PAGE_OFFSET = (req.query.page - 1) * OrderPagelimit
      }
      //要改用sql語法去撈關聯資料，用include會有問題
      const orders = await Order.findAndCountAll({
        raw: true,
        nest: true,
        // includes: ['items'],
        limit: OrderPagelimit,
        offset: PAGE_OFFSET,
        where:{ UserId: userId}
      })

      const page = Number(req.query.page) || 1
      const pages = Math.ceil(orders.count / OrderPagelimit)
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1

      return res.render('user/orders', {
        orders: orders.rows,
        page: page,
        totalPage: totalPage,
        prev: prev,
        next: next,
        user: user.toJSON()
      })
    }catch(err){
      console.log(err)
      return res.render('error',{err:'個人葉面錯誤'})
    }
  },

  getFavoritespage: async (req, res) => {
    try {
      let products = await User.findByPk(req.user.id, {
        include: [
          { model: Product, as: 'FavoritedProducts' }
        ]
      })
      products = products ? products.toJSON() : products
      return res.render('favorites', {
        products: products.FavoritedProducts
      })
    } catch (err) {
      console.log(err)
    }
  },

  addFavorite: async (req, res) => {
    try {
      const product = await Favorite.create({
        UserId: req.user.id,
        ProductId: req.params.productId
      })
      req.flash('success_messages', '已收藏該產品')
      res.redirect('back')
    } catch (err) {
      console.log(err)
    }
  },

  removeFavorite: async (req, res) => {
    try {
      const favorite = await Favorite.findOne({
        where: {
          UserId: req.user.id,
          ProductId: req.params.productId
        }
      })
      await favorite.destroy()
      req.flash('success_messages', '已移除該收藏')
      res.redirect('back')
    } catch (err) {
      console.log(err)
    }


  },

  logout: (req, res) => {
    req.flash('success_messages', '成功登出')
    req.logout()
    return res.redirect('/')
  }


}



module.exports = userController