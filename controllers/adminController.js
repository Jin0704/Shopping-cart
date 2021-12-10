const db = require('../models')
const Product = db.Product
const Order = db.Order
const Category = db.Category
const OrderItems = db.OrderItems
const fs = require('fs')
const imgur = require('imgur')
const { error } = require('console')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setAPIUrl('https://api.imgur.com/3/')
const PAGE_LIMIT = 6
const categoryId = {
  '食物': 1,
  '衣物': 11,
  '休閒娛樂': 21,
  '住家裝飾': 31,
  '書籍': 41,
  '其它': 51
}

const adminController = {

  getProducts: async (req, res) => {
    try {

      let PAGE_OFFSET = 0
      if (req.query.page) {
        PAGE_OFFSET = (req.query.page - 1) * PAGE_LIMIT
      }

      const products = await Product.findAndCountAll({
        raw: true,
        nest: true,
        limit: PAGE_LIMIT,
        offset: PAGE_OFFSET
      })
      let page = Number(req.query.page) || 1
      const pages = Math.ceil(products.count / PAGE_LIMIT)
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1

      return res.render('admin/products', {
        products: products.rows,
        page: page,
        totalPage: totalPage,
        prev: prev,
        next: next
      })
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
          image: file ? img.link : null,
          CategoryId: categoryId[req.body.category]
        })
      } else {
        const products = await Product.create({
          name: req.body.name,
          price: req.body.price,
          description: req.body.description,
          image: null,
          CategoryId: categoryId[req.body.category]
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
      const product = await Product.findByPk(req.params.id, { raw: true, nest: true, include: [Category] })
      console.log(product)
      return res.render('admin/product', {
        product: product
      })
    } catch (err) {
      console.log(err)
    }
  },

  editProduct: async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id, { raw: true, nest: true, include: [Category] })
      console.log(product)
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
        const product = await Product.findByPk(req.params.id, { include: [Category] })
        // console.log(categoryId[req.body.category])
        await product.update({
          name: req.body.name,
          price: req.body.price,
          description: req.body.description,
          image: file ? img.link : product.image,
          CategoryId: categoryId[req.body.category]
        })
      } else {
        const product = await Product.findByPk(req.params.id, { include: [Category] })
        console.log(req.body)
        // console.log(categoryId[req.body.category])
        await product.update({
          name: req.body.name,
          price: req.body.price,
          description: req.body.description,
          image: product.image,
          CategoryId: categoryId[req.body.category]
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
      let PAGE_OFFSET = 0
      const OrderPagelimit = 10
      if (req.query.page) {
        PAGE_OFFSET = (req.query.page - 1) * OrderPagelimit
      }

      const orders = await Order.findAndCountAll({
        raw: true,
        nest: true,
        includes: ['items'],
        limit: OrderPagelimit,
        offset: PAGE_OFFSET
      })

      const page = Number(req.query.page) || 1
      const pages = Math.ceil(orders.count / OrderPagelimit)
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1
      console.log(orders)

      return res.render('admin/orders', {
        orders: orders.rows,
        page: page,
        totalPage: totalPage,
        prev: prev,
        next: next
      })
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