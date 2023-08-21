const db = require('../models')
const User = db.User
const Favorite = db.Favorite
const Product = db.Product
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
      return res.render('user',{user:user.toJSON()})
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