const db = require('../models')
const Product = db.Product
const Order = db.Order
const OrderItems = db.OrderItems
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

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
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Product.create({
          name: req.body.name,
          price: req.body.price,
          description: req.body.description,
          image: file ? img.data.link : null
        }).then((product) => {
          req.flash('success_messages', '新增成功')
          return res.redirect('/admin/products')
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
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Product.findByPk(req.params.id)
          .then((product) => {
            product.update({
              name: req.body.name,
              price: req.body.price,
              description: req.body.description,
              image: file ? img.data.link : product.image
            }).then((product) => {
              req.flash('success_messages', '更新成功')
              return res.redirect('/admin/products')
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
  },
  getOrders: (req, res) => {
    Order.findAll({
      raw: true,
      nest: true,
      includes: ['items']
    }).then((orders) => {
      return res.render('admin/orders', { orders })
    })
  }
}


module.exports = adminController