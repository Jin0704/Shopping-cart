const db = require('../models')
const User = db.User


const userController = {

  getSigninPage: (req, res) => {
    return res.render('signin')
  },

  getSignUpPage: (req, res) => {
    return res.render('signup')
  }


}



module.exports = userController