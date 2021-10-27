const db = require('../models')
const Product = db.Product
const Order = db.Order
const OrderItems = db.OrderItems
const fs = require('fs')
const imgur = require('imgur')
const { error } = require('console')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setAPIUrl('https://api.imgur.com/3/')

const adminController = {

  getProducts: async (req, res) => {
    try {
      const products = await Product.findAll({ raw: true })
      return res.render('admin/products', { products: products })
    } catch (err) {
      console.log(err)
    }
  },

  createProducts: (req, res) => {
    return res.render('admin/create')
  },

  postProdcuts: async (req, res) => {
    try {
      const { file } = req
      if (file) {
        imgur.setClientId(IMGUR_CLIENT_ID);
        const img = await imgur.uploadFile(req.file.path)
        const products = await Product.create({
          name: req.body.name,
          price: req.body.price,
          description: req.body.description,
          image: file ? img.link : null
        })
      } else {
        const products = await Product.create({
          name: req.body.name,
          price: req.body.price,
          description: req.body.description,
          image: null
        })
      }
      req.flash('success_messages', '新增成功')
      return res.redirect('/admin/products')
    } catch (err) {
      console.log(err)
    }

  },

  getProduct: async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id, { raw: true })
      return res.render('admin/product', {
        product: product
      })
    } catch (err) {
      console.log(err)
    }
  },

  editProduct: async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id, { raw: true })
      return res.render('admin/create', { product: product })
    } catch (err) {
      console.log(err)
    }
  },

  putProduct: async (req, res) => {
    try {
      const { file } = req
      if (file) {
        imgur.setClientId(IMGUR_CLIENT_ID);
        const img = await imgur.uploadFile(file.path)
        const product = await Product.findByPk(req.params.id)
        await product.update({
          name: req.body.name,
          price: req.body.price,
          description: req.body.description,
          image: file ? img.link : product.image
        })
      } else {
        const product = await Product.findByPk(req.params.id)
        await product.update({
          name: req.body.name,
          price: req.body.price,
          description: req.body.description,
          image: product.image
        })
      }
      req.flash('success_messages', '更新成功')
      res.redirect('/admin/products')
    } catch (err) {
      console.log(err)
    }

  },

  deleteProduct: async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id)
      await product.destroy()
      req.flash('success_messages', '成功刪除')
      res.redirect('/admin/products')
    } catch (err) {
      console.log(err)
    }
  },

  getOrders: async (req, res) => {
    try {
      const orders = await Order.findAll({
        raw: true,
        nest: true,
        includes: ['items']
      })
      return res.render('admin/orders', { orders })
    } catch (err) {
      console.log(err)
    }

  },

  getOrder: async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id, { include: 'items' })
      return res.render('admin/order', { order: order.toJSON(), })
    } catch (error) {
      console.log(error)
    }

  },

  putOrder: async (req, res) => {
    try {
      let order = await Order.findByPk(req.params.id)
      await order.update({
        payment_status: req.body.payment_status,
        shipping_status: req.body.shipping_status
      })
      req.flash('success_messages', '更新成功')
      return res.redirect('/admin/orders')
    } catch (err) {
      console.log(err)
    }
  },

  deleteOrder: async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id)
      await order.destroy()
      req.flash('success_messages', '刪除成功')
      return res.redirect('/admin/orders')
    } catch (err) {
      console.log(err)
    }
  }
}


module.exports = adminController