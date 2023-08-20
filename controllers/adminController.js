const db = require('../models')
const Product = db.Product
const Order = db.Order
const Category = db.Category
const OrderItems = db.OrderItems
const PaymentMethod = db.PaymentMethod
const fs = require('fs')
const uploadFileToS3 = require('../helper/uploadFileToS3')
const PAGE_LIMIT = 6
const redis = require('../redis')
const yupCheck = require('../helper/yupCheck')

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
        offset: PAGE_OFFSET,
        include:Category
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
      return res.render('error',{err})
    }
  },

  createProducts: async (req, res) => {
    const categories = await Category.findAll({raw:true,attributes:['id','name']})
    return res.render('admin/create',{categories})
  },

  postProducts: async (req, res) => {
    try {
      const imageUrl = req.file ? await uploadFileToS3(req): ''
      const input = {...req.body, image: imageUrl}
      await yupCheck.productShape(input)
      await Product.create({...input})
      req.flash('success_messages', '新增成功')
      return res.redirect('/admin/products')
    } catch (err) {
      console.log(err)
      return res.render('error',{err})
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
      return res.render('error',{err})
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
      return res.render('admin/create', { product, categories })
    } catch (err) {
      console.log(err)
      return res.render('error',{err})
    }
  },

  putProduct: async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id, { include: [Category] })
      if(!product){ return res.render('error',{err:'product not exists!'}) }
      const imageUrl  =  req.file ? await uploadFileToS3(req) : product.image
      const input = {...req.body, image: imageUrl}
      await yupCheck.productShape(input)
      await product.update({...input})
      req.flash('success_messages', '更新成功')
      res.redirect('/admin/products')
    } catch (err) {
      console.log(err)
      return res.render('error',{err})
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
      return res.render('error',{err})
    }
  },

  getOrders: async (req, res) => {
    try {
      let PAGE_OFFSET = 0
      const OrderPagelimit = 10
      if (req.query.page) {
        PAGE_OFFSET = (req.query.page - 1) * OrderPagelimit
      }
      //要改用sql語法去撈關聯資料，用include會有問題
      const orders = await Order.findAndCountAll({
        raw: true,
        nest: true,
        // includes: ['items'],
        limit: OrderPagelimit,
        offset: PAGE_OFFSET,
      })

      const page = Number(req.query.page) || 1
      const pages = Math.ceil(orders.count / OrderPagelimit)
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1

      return res.render('admin/orders', {
        orders: orders.rows,
        page: page,
        totalPage: totalPage,
        prev: prev,
        next: next
      })
    } catch (err) {
      console.log(err)
      return res.render('error',{err})
    }

  },

  getOrder: async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id, { include: ['items','methods'] })
      return res.render('admin/order', { order: order.toJSON(), })
    } catch (error) {
      console.log(error)
      return res.render('error',{err})
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
      return res.render('error',{err})
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
      return res.render('error',{err})
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
      return res.render('error',{err})
    }
  },

  getCategory: async(req,res)=>{
    try {
      const category = await Category.findByPk(req.params.id)
      return res.render('admin/category', { category: category.toJSON(), })
    } catch (error) {
      console.log(error)
      return res.render('error',{err})
    }
  },

  createCategory: async (req, res) => {
    await redis.clearKey('admin-categories')
    return res.render('admin/createCategory')
  },

  postCategory: async(req,res)=>{
    try {
      await yupCheck.categoryShape(req.body)
      await Category.create({
        name: req.body.name,
        status: req.body.status
      })
      await redis.clearKey('admin-categories')
      req.flash('success_messages', '新增成功')
      return res.redirect('/admin/categories')
    } catch (err) {
      console.log(err)
      return res.render('error',{err})
    }
  },

  editCategory: async (req, res) => {
    try {
      const category = await Category.findByPk(req.params.id)
      await yupCheck.categoryShape(req.body)
      await category.update({
        name: req.body.name,
        status: req.body.status
      })
      await redis.clearKey('admin-categories')
      req.flash('success_messages', '更新成功')
      return res.redirect('/admin/categories')
    } catch (err) {
      console.log(err)
      return res.render('error',{err})
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
      return res.render('error',{err})
    }
  },
  getPaymentMethods: async(req,res)=>{
    try{
      let data;
      data = await redis.getKey('admin-paymentMethods')
      if(data){
        return res.render('admin/paymentMethods', {
          paymentMethods:data
        })
      }
      data = await PaymentMethod.findAll({ raw: true})
      await redis.setKey('admin-paymentMethods',JSON.stringify(data))
      return res.render('admin/paymentMethods', { paymentMethods: data })
    }catch(err){
      console.error(err)
      return res.render('error',{err})
    }
  },
  getPaymentMethod: async(req,res)=>{
    try {
      const paymentMethod = await PaymentMethod.findByPk(req.params.id)
      return res.render('admin/paymentMethod', { paymentMethod: paymentMethod.toJSON() })
    } catch (error) {
      console.log(error)
      return res.render('error',{err})
    }
  },
  createPaymentMethod: async (req, res) => {
    return res.render('admin/createPaymentMethod')
  },
  postPaymentMethod: async(req,res)=>{
    try {
      await yupCheck.paymentMethodShape(req.body)
      await PaymentMethod.create({
        name: req.body.name,
        status: req.body.status
      })
      await redis.clearKey('admin-paymentMethods')
      req.flash('success_messages', '新增成功')
      return res.redirect('/admin/paymentMethods')
    } catch (err) {
      console.log(err)
      return res.render('error',{err})
    }
  },

  editPaymentMethod: async (req, res) => {
    try {
      await yupCheck.paymentMethodShape(req.body)
      const paymentMethod = await PaymentMethod.findByPk(req.params.id)
      await paymentMethod.update({
        name: req.body.name,
        status: req.body.status
      })
      await redis.clearKey('admin-paymentMethods')
      req.flash('success_messages', '更新成功')
      return res.redirect('/admin/paymentMethods')
    } catch (err) {
      console.log(err)
      return res.render('error',{err})
    }
  },

  deletePaymentMethod: async (req, res) => {
    try {
      const paymentMethod = await PaymentMethod.findByPk(req.params.id)
      await paymentMethod.destroy()
      await redis.clearKey('admin-paymentMethods')
      req.flash('success_messages', '刪除成功')
      return res.redirect('/admin/paymentMethods')
    } catch (err) {
      console.log(err)
      return res.render('error',{err})
    }
  },  
}


module.exports = adminController