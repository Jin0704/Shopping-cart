const db = require('../models')
const User = db.User
const bcrypt = require('bcryptjs')

const userController = {

  getSigninPage: (req, res) => {
    return res.render('signin')
  },

  getSignUpPage: (req, res) => {
    return res.render('signup')
  },

  SignUp: async (req, res) => {
    // console.log(req.body)
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
  },

  Signin: (req, res) => {
    req.flash('success_messages', '成功登入')
    return res.redirect('/')
  },

  logout: (req, res) => {
    req.flash('success_messages', '成功登出')
    req.logout()
    return res.redirect('/')
  }


}



module.exports = userController