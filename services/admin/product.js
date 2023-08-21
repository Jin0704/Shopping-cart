const db = require('../../models')
const Product = db.Product
const _ = require('lodash')
const uploadFileToS3 = require('../../helper/uploadFileToS3')
const yupCheck = require('../../helper/yupCheck')

const ProductService = {
  getProducts: async(req)=>{
    try{
      const PAGE_LIMIT = req.query.perPage ? req.query.perPage : 6
      const PAGE_OFFSET = req.query.page ? (req.query.page-1) * PAGE_LIMIT : 0
      
      const products = await Product.findAndCountAll({
        raw: true,
        nest: true,
        limit: PAGE_LIMIT,
        offset: PAGE_OFFSET
      })

      const page = Number(req.query.page) || 1
      const pages = Math.ceil(products.count / PAGE_LIMIT)
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1
      
      return {
        products: products.rows,
        page: page,
        totalPage: totalPage,
        prev: prev,
        next: next
      }
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  },
  getProduct: async(req)=>{
    try{
      const product = await Product.findByPk(req.params.id,{raw:true})
      if (!product){ throw new Error('Product not exists!')}
      return { product }
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  },
  postProduct: async(req)=>{
    try{
      const imageUrl = req.file ? await uploadFileToS3(req): ''
      const input = { ...req.body, image:imageUrl}
      await yupCheck.productShape(input)
      await Product.create({ ...input })
      return { 'message':' 產品新增成功'}
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  },
  putProduct: async(req)=>{
    try{
      const product =  await Product.findByPk(req.params.id)
      if (!product){
        throw new error('Product not exists!')
      }
      const imageUrl  = req.file ? await uploadFileToS3(req) : product.image
      const input = { ...req.body, image:imageUrl}
      await yupCheck.productShape(input)
      await product.update({...input })
      return { 'message':' 產品更新成功'}
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  },
  deleteProduct: async(req)=>{
    try{
      const product =  await Product.findByPk(req.params.id)
      if (!product){
        throw new error('Product not exists!')
      }
      await product.destroy()
      return { 'message':' 產品刪除成功'}
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  },
}

module.exports = ProductService