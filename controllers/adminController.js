const db = require('../models')
const Product = db.Product

const adminController = {
  getProducts: (req, res) => {
    return Product.findAll({ raw: true }).then(products => {
      return res.render('admin/products', { products: products })
    })
  },
  createProducts: (req, res) => {
    return res.render('admin/create')
  },
  postProdcuts: (req, res) => {
    return Product.create({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description
    }).then((products) => {
      req.flash('success_messages', '新增成功')
      return res.redirect('/admin/products')
    })
  },
  getProduct: (req, res) => {
    Product.findByPk(req.params.id, { raw: true })
      .then(product => {
        return res.render('admin/product', {
          product: product
        })
      })
  }
}


module.exports = adminController