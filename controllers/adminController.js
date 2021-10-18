const db = require('../models')
const Product = db.Product
const fs = require('fs')

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
    const { file } = req
    if (file) {
      fs.readFile(file.path, (err, data) => {
        if (err) console.log(err)
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          return Product.create({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            image: file ? `/upload/${file.originalname}` : null
          }).then((product) => {
            req.flash('success_messages', '新增成功')
            return res.redirect('/admin/products')
          })
        })
      })
    } else {
      return Product.create({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        image: null
      }).then((products) => {
        req.flash('success_messages', '新增成功')
        return res.redirect('/admin/products')
      })
    }
  },
  getProduct: (req, res) => {
    Product.findByPk(req.params.id, { raw: true })
      .then(product => {
        return res.render('admin/product', {
          product: product
        })
      })
  },
  editProduct: (req, res) => {
    Product.findByPk(req.params.id, { raw: true })
      .then(product => {
        return res.render('admin/create', {
          product: product
        })
      })
  },
  putProduct: (req, res) => {

    const { file } = req
    if (file) {
      fs.readFile(file.path, (err, data) => {
        if (err) console.log(err)
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          return Product.findByPk(req.params.id)
            .then((product) => {
              product.update({
                name: req.body.name,
                price: req.body.price,
                description: req.body.description,
                image: file ? `/upload/${file.originalname}` : product.image
              }).then((product) => {
                req.flash('success_messages', '更新成功')
                return res.redirect('/admin/products')
              })
            })
        })
      })
    } else {
      return Product.findByPk(req.params.id)
        .then((product) => {
          product.update({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            image: product.image
          }).then((product) => {
            req.flash('success_messages', '更新成功')
            res.redirect('/admin/products')
          })
        })
    }
  },
  deleteProduct: (req, res) => {
    return Product.findByPk(req.params.id)
      .then((product) => {
        product.destroy()
          .then((product) => {
            req.flash('success_messages', '成功刪除')
            res.redirect('/admin/products')
          })
      })
  }
}


module.exports = adminController