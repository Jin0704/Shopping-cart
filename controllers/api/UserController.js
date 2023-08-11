const UserService = require('../../services/user')
const responseBuilder = require('../../helper/responseBuilder')

const UserController = {
  SignUp: async (req, res) => {
    let data;
    try {
      const input = req.body
      data = await UserService.signUp(input)
    } catch (err) {
      console.error(err)
      return responseBuilder.error(req, res, 400, err)
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
      return responseBuilder.error(req, res, 400, err)
    }
    return responseBuilder.success(res, 200, data)
  },

  getFavoritesPage: async (req, res) => {
    let data;
    try {
      data = await UserService.getFavoritesPage(req)
    } catch (err) {
      console.error(err)
      return responseBuilder.error(req, res, 400, err)
    }
    return responseBuilder.success(res, 200, data)
  },
  addFavorite: async (req, res) => {
    let data;
    try {
      data = await UserService.addFavorite(req);
    } catch (err) {
      console.error(err)
      return responseBuilder.error(req, res, 400, err)
    }
    return responseBuilder.success(res, 200, data)
  },
  removeFavorite: async (req, res) => {
    let data;
    try {
      data = await UserService.removeFavorite(req);
    } catch (err) {
      console.error(err)
      return responseBuilder.error(req, res, 400, err)
    }
    return responseBuilder.success(res, 200, data)
  }

}





module.exports = UserController