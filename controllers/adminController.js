const db = require('../models')
const Product = db.Product
const Order = db.Order
const Category = db.Category
const OrderItems = db.OrderItems
const fs = require('fs')
const uploadFileToS3 = require('../helper/uploadFileToS3')
const PAGE_LIMIT = 6
const redis = require('../redis')

const adminController = {
  getProducts: async (req, res) => {
    try {
      let data;
      data = await redis.getKey('admin-products')
      if(data){
        return res.render('admin/products', {
          ...data
        })
      }
      let PAGE_OFFSET = 0
      if (req.query.page) {
        PAGE_OFFSET = (req.query.page - 1) * PAGE_LIMIT
      }

      const products = await Product.findAndCountAll({
        raw: true,
        nest: true,
        limit: PAGE_LIMIT,
        offset: PAGE_OFFSET,
        include:Category
      })
      let page = Number(req.query.page) || 1
      const pages = Math.ceil(products.count / PAGE_LIMIT)
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1

      data = {
        products: products.rows,
        page: page,
        totalPage: totalPage,
        prev: prev,
        next: next
      }
      await redis.setKey('admin-products',JSON.stringify(data))
      return res.render('admin/products', {
        ...data
      })
    } catch (err) {
      console.log(err)
    }
  },

  createProducts: async (req, res) => {
    const categories = await Category.findAll({raw:true,attributes:['id','name']})
    await redis.clearKey('products')
    await redis.clearKey('admin-products')
    return res.render('admin/create',{categories})
  },

  postProducts: async (req, res) => {
    try {
      const { file } = req
      if (file) {
        let imageUrl  = await uploadFileToS3(req)
        const products = await Product.create({
          name: req.body.name,
          price: req.body.price,
          description: req.body.description,
          image: imageUrl ? imageUrl : '',
          CategoryId: req.body.categoryId
        })
      } else {
        const products = await Product.create({
          name: req.body.name,
          price: req.body.price,
          description: req.body.description,
          image: '',
          CategoryId: req.body.categoryId
        })
      }
      await redis.clearKey('products')
      await redis.clearKey('admin-products')
      req.flash('success_messages', '新增成功')
      return res.redirect('/admin/products')
    } catch (err) {
      console.log(err)
    }

  },

  getProduct: async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id, { raw: true, nest: true, include: [Category] })
      return res.render('admin/product', {
        product: product,
      })
    } catch (err) {
      console.log(err)
    }
  },

  editProduct: async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id, { raw: true, nest: true, include: [Category] })
      const categories = await Category.findAll({
        raw:true,
        where:{status:1},
        attributes:['id','name']
      })
      await redis.clearKey('products')
      await redis.clearKey('admin-products')
      return res.render('admin/create', { product, categories })
    } catch (err) {
      console.log(err)
    }
  },

  putProduct: async (req, res) => {
    try {
      const { file } = req
      if (file) {
        let imageUrl  = await uploadFileToS3(req)
        const product = await Product.findByPk(req.params.id, { include: [Category] })
        await product.update({
          name: req.body.name,
          price: req.body.price,
          description: req.body.description,
          image: imageUrl ? imageUrl: product.image,
          CategoryId: req.body.categoryId
        })
      } else {
        const product = await Product.findByPk(req.params.id, { include: [Category] })
        await product.update({
          name: req.body.name,
          price: req.body.price,
          description: req.body.description,
          image: product.image,
          CategoryId: req.body.categoryId
        })
      }
      await redis.clearKey('products')
      await redis.clearKey('admin-products')
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
      await redis.clearKey('products')
      await redis.clearKey('admin-products')
      req.flash('success_messages', '成功刪除')
      res.redirect('/admin/products')
    } catch (err) {
      console.log(err)
    }
  },

  getOrders: async (req, res) => {
    try {
      let data;
      data = await redis.getKey('admin-orders')
      if(data){
        return res.render('admin/orders', {
        ...data
        })
      }
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
     
      data ={
        orders: orders.rows,
        page: page,
        totalPage: totalPage,
        prev: prev,
        next: next
      }
      await redis.setKey('admin-orders',JSON.stringify(data))
      return res.render('admin/orders', {
        ...data
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
      await redis.clearKey(`user${order.toJSON().UserId}_orders`)
      await redis.clearKey('admin-orders')
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
      await redis.clearKey(`user${order.toJSON().UserId}_orders`)
      await redis.clearKey('admin-orders')
      req.flash('success_messages', '刪除成功')
      return res.redirect('/admin/orders')
    } catch (err) {
      console.log(err)
    }
  },

  getCategories: async(req,res)=>{
    try {
      let data;
      data = await redis.getKey('admin-categories')
      if(data){
        return res.render('admin/categories', {
          ...data
        })
      }
      let PAGE_OFFSET = 0
      const categoryPagelimit = 10
      if (req.query.page) {
        PAGE_OFFSET = (req.query.page - 1) * categoryPagelimit
      }

      const categories = await Category.findAndCountAll({
        raw: true,
        nest: true,
        limit: categoryPagelimit,
        offset: PAGE_OFFSET,
        attributes:['id','name','status']
      })

      const page = Number(req.query.page) || 1
      const pages = Math.ceil(categories.count / categoryPagelimit)
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1

      data = {
        categories: categories.rows,
        page: page,
        totalPage: totalPage,
        prev: prev,
        next: next
      }
      await redis.setKey('admin-categories',JSON.stringify(data))
      return res.render('admin/categories', {
        ...data
      })
    } catch (err) {
      console.log(err)
    }
  },

  getCategory: async(req,res)=>{
    try {
      const category = await Category.findByPk(req.params.id)
      return res.render('admin/category', { category: category.toJSON(), })
    } catch (error) {
      console.log(error)
    }
  },

  createCategory: async (req, res) => {
    await redis.clearKey('admin-categories')
    return res.render('admin/createCategory')
  },

  postCategory: async(req,res)=>{
    try {
      await Category.create({
        name: req.body.name,
        status: req.body.status
      })
      await redis.clearKey('admin-categories')
      req.flash('success_messages', '新增成功')
      return res.redirect('/admin/categories')
    } catch (err) {
      console.log(err)
    }
  },

  editCategory: async (req, res) => {
    try {
      let category = await Category.findByPk(req.params.id)
      await category.update({
        name: req.body.name,
        status: req.body.status
      })
      await redis.clearKey('admin-categories')
      req.flash('success_messages', '更新成功')
      return res.redirect('/admin/categories')
    } catch (err) {
      console.log(err)
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const category = await Category.findByPk(req.params.id)
      await category.destroy()
      await redis.clearKey('admin-categories')
      req.flash('success_messages', '刪除成功')
      return res.redirect('/admin/categories')
    } catch (err) {
      console.log(err)
    }
  },
}


module.exports = adminController