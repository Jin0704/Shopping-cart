const uploadFileToS3 = require('../../helper/uploadFileToS3')
const CommonService = require('../../services/common')
class ProductController{
  constructor(ProductService){
    this.ProductService = ProductService
  }
  
  findAll = async(req,res)=>{
    try{
      const products = await this.ProductService.findAll(req)
      const pagination = await CommonService.calculatePagination({},products.count,req.query.page)
      return res.render('admin/products', { products:products.rows, ...pagination })
    }catch(err){
      console.error(err)
      return res.render('error',{err})
    }
  }

  findOne = async(req,res)=>{
    try{
      const product = await this.ProductService.findOne(req.params.id)
      return res.render('admin/product', { product:product.toJSON() })
    }catch(err){
      console.error(err)
      return res.render('error',{err})
    }
  }

  createPage = async(req,res)=>{
    try{
      const categories = await this.ProductService.getCategories(req)
      return res.render('admin/create',{categories})
    }catch(err){
      console.error(err)
      return res.render('error',{err})
    }
  }

  store = async(req,res)=>{
    try{
      const imageUrl = req.file ? await uploadFileToS3(req): ''
      const input = {...req.body, image: imageUrl}
      await this.ProductService.store(input) 
      req.flash('success_messages', '新增成功')
      return res.redirect('/admin/products')
    }catch(err){
      console.error(err)
      return res.render('error',{err})
    }
  }

  edit = async(req,res)=>{
    try{
      const product = await this.ProductService.findOne(req.params.id)
      const categories = await this.ProductService.getCategories(req)
      return res.render('admin/create', { product:product.toJSON(), categories })
    }catch(err){
      console.error(err)
      return res.render('error',{err})
    }
  }

  update = async(req,res)=>{
    try{
      const imageUrl = req.file ? await uploadFileToS3(req): ''
      const input = {...req.body, image: imageUrl}
      await this.ProductService.update(req.params.id, input)
      req.flash('success_messages', '更新成功')
      res.redirect('/admin/products')
    }catch(err){
      console.error(err)
      return res.render('error',{err})
    }
  }

  delete = async(req,res)=>{
    try{
      await this.ProductService.delete(req.params.id)
      req.flash('success_messages', '成功刪除')
      res.redirect('/admin/products')
    }catch(err){
      console.error(err)
      return res.render('error',{err})
    }    
  }
}


module.exports = ProductController