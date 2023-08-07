const UserService = require('../../services/UserService')
const responseBuilder = require('../../helper/responseBuilder')

const UserController = {
  SignUp: async (req, res) => {
    let data;
    try {
      const input = req.body
      data = await UserService.signUp(input)
    } catch (err) {
      console.error(err)
      return responseBuilder.error(req, res, 500, err)
    }

    return responseBuilder.success(res, 200, data)
  },
  SignIn: async (req, res) => {
    let data;
    try {
      const input = req.body
      data = await UserService.signIn(input)
    } catch (err) {
      console.error(err)
      return responseBuilder.error(req, res, 500, err)
    }
    return responseBuilder.success(res, 200, data)
  }

}





module.exports = UserController