const ProductService = require('../../services/product')
const responseBuilder = require('../../helper/responseBuilder')

let ProductController = {

  // 要再將search跟sort 合併進這個controller
  getProducts: async (req, res) => {
    let data;
    try {
      data = await ProductService.getProducts(req)
    } catch (err) {
      console.error(err)
      return responseBuilder.error(req, res, 400, err)
    }
    return responseBuilder.success(res, 200, data)
  },

  getProduct: async (req, res) => {
    let data;
    try {
      data = await ProductService.getProduct(req)
    } catch (err) {
      console.error(err)
      return responseBuilder.error(req, res, 400, err)
    }

    return responseBuilder.success(res, 200, data)
  },
}


module.exports = ProductController