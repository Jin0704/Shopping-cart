const db = require('../models')
const User = db.User
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserService = {
  signUp: async (input) => {
    try {
      // console.log(req.body)
      if (input.confirmpassword !== input.password) {
        throw new Error('密碼輸入不同')
      }
      const user = await User.findOne({ where: { email: input.email } })
      if (user) {
        throw new Error('信箱已被註冊')
      }

      await User.create({
        email: input.email,
        password: bcrypt.hashSync(input.password, bcrypt.genSaltSync(6))
      })

      return { messages: '註冊成功' }
    } catch (err) {
      console.error(err)
      throw new Error(err)
    }
  },
  signIn: async (input) => {
    try {
      // checking user exists
      const user = await User.findOne({ where: { email: input.email }, select: ['email'] })
      if (!user) {
        throw new Error('使用者不存在')
      }
      // check password
      if (!bcrypt.compareSync(input.password, user.password)) {
        throw new Error('密碼輸入錯誤')
      }
      const userData = user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })

      return {
        status: 'success',
        data: {
          token,
          user: userData
        }
      }

    } catch (err) {
      console.error(err)
      throw new Error(err)
    }

  }
}



module.exports = UserService