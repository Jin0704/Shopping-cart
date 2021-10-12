const db = require('../models')
const User = db.User


const userController = {

  getSigninPage: (req, res) => {
    return res.render('signin')
  },

  getSignUpPage: (req, res) => {
    return res.render('signup')
  },

  SignUp: (req, res) => {
    // console.log(req.body)
    const { email, password, role } = req.body
    return User.create({
      email: email,
      password: password,
      role: role
    }).then(() => {
      return res.redirect('/signin')
    })
  }

}



module.exports = userController