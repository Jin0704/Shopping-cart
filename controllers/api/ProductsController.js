const ProductService = require('../../services/product')
const responseBuilder = require('../../helper/responseBuilder')
const redis = require('../../redis')
let ProductController = {

  // 要再將search跟sort 合併進這個controller
  getProducts: async (req, res) => {
    let data;
    try {
      const result  = await redis.getKey('products')
      data = result ? result : await ProductService.getProducts(req)
    } catch (err) {
      console.error(err)
      return responseBuilder.error(req, res, 400, err)
    }
    return responseBuilder.success(res, 200, data)
  },

  getProduct: async (req, res) => {
    let data;
    try {
      const result = await redis.getKey(`product-${req.params.id}`)
      data = result ? result : await ProductService.getProduct(req)
    } catch (err) {
      console.error(err)
      return responseBuilder.error(req, res, 400, err)
    }

    return responseBuilder.success(res, 200, data)
  },
}


module.exports = ProductController