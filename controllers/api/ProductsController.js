const ProductService = require('../../services/product')
const responseBuilder = require('../../helper/responseBuilder')
const redis = require('../../redis')
let ProductController = {

  // 要再將search跟sort 合併進這個controller
  getProducts: async (req, res) => {
    try {
      let data = await redis.getKey('api-products') ? await redis.getKey('api-products'):await ProductService.getProducts(req)
      return responseBuilder.success(res, 200, data)
    } catch (err) {
      console.error(err)
      return responseBuilder.error(req, res, 400, err)
    }

  },

  getProduct: async (req, res) => {
    try {
      let data = await redis.getKey(`api-products-${req.params.id}`) ? await redis.getKey(`api-products-${req.params.id}`):await ProductService.getProduct(req)
      return responseBuilder.success(res, 200, data)
    } catch (err) {
      console.error(err)
      return responseBuilder.error(req, res, 400, err)
    }
  },
}


module.exports = ProductController