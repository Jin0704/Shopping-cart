const db = require('../models')
const Product = db.Product
const User = db.User
const Cart = db.Cart
const PAGE_LIMIT = 6
const redis = require('../redis')

const ProductService = {
  getProducts: async (req, res) => {
    try {
      let data;
      const PAGE_OFFSET = req.query.page ? (req.query.page - 1) * PAGE_LIMIT : 0
      // 如果有req.user的話 可能要直接下sql語法
      const products = await Product.findAndCountAll({
        raw: true,
        nest: true,
        offset: PAGE_OFFSET,
        limit: PAGE_LIMIT,
      })

      const page = Number(req.query.page) || 1
      const pages = Math.ceil(products.count / PAGE_LIMIT)
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)

      data = {
        products,
        page,
        totalPage,
      }

      await redis.setKey('products', JSON.stringify(data))

      return {
        ...data
      }
    } catch (err) {
      console.error(err)
      throw new Error(err)
    }
  },

  getProduct: async (req, res) => {
    try {
      let product = await Product.findByPk(req.params.id, { include: { model: User, as: 'FavoritedUsers' } })
      product['dataValues'].isFavorited = req.user? product.FavoritedUsers.map(d => d.id).includes(req.user.id) : false
      delete product['dataValues'].FavoritedUsers
      await redis.setKey(`product-${req.params.id}`,JSON.stringify(product))
      return { product }
    } catch (err) {
      console.error(err)
      throw new Error(err)
    }
  },
}




module.exports = ProductService