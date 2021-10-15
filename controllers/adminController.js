const db = require('../models')
const Product = db.Product

const adminController = {
  getProducts: (req, res) => {
    return Product.findAll({ raw: true }).then(products => {
      return res.render('admin/products', { products: products })
    })
  }
}


module.exports = adminController