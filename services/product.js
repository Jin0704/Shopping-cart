const db = require('../models')
const Product = db.Product
const User = db.User
const PAGE_LIMIT = 6
const redis = require('../redis')

const ProductService = {
  /**取得所有產品 */
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

      return {
        ...data
      }
    } catch (err) {
      console.error(err)
      throw new Error(err)
    }
  },
  /**取得單一產品 */
  getProduct: async (req, res) => {
    try {
      let product = await Product.findByPk(req.params.id, { include: { model: User, as: 'FavoritedUsers' } })
      if(!product) throw new Error('product not exists!')
      product['dataValues'].isFavorited = req.user? product.FavoritedUsers.map(d => d.id).includes(req.user.id) : false
      delete product['dataValues'].FavoritedUsers
      return { product }
    } catch (err) {
      console.error(err)
      throw new Error(err)
    }
  },
}




module.exports = ProductService