const db = require('../../models')
const Product = db.Product
const Category = db.Category
const yupCheck = require('../../helper/yupCheck')
const uploadFileToS3 = require('../../helper/uploadFileToS3')
const PAGE_LIMIT = 6

const ProductController = {
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
}

module.exports = ProductController