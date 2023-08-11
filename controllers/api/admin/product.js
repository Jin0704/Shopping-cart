const responseBuilder = require('../../../helper/responseBuilder')
const ProductService = require('../../../services/admin/product')

const ProductController = {
  getProducts: async(req,res)=>{
    let data;
    try{
      data = await ProductService.getProducts(req)
    }catch(err){
      console.error(err)
      return responseBuilder.error(req,res,400,err)
    }
    return responseBuilder.success(res,200,data)
  },
  getProduct: async(req,res)=>{
    let data;
    try{
      data = await ProductService.getProduct(req)
    }catch(err){
      console.error(err)
      return responseBuilder.error(req,res,400,err)
    }
    return responseBuilder.success(res,200,data)
  },
  postProduct: async(req,res)=>{
    let data;
    try{
      data = await ProductService.postProduct(req)
    }catch(err){
      console.error(err)
      return responseBuilder.error(req,res,400,err)
    }
    return responseBuilder.success(res,200,data)
  },
  putProduct: async(req,res)=>{
    let data;
    try{
      data = await ProductService.putProduct(req)
    }catch(err){
      console.error(err)
      return responseBuilder.error(req,res,400,err)
    }
    return responseBuilder.success(res,200,data)
  },
  deleteProduct: async(req,res)=>{
    let data;
    try{
      data = await ProductService.deleteProduct(req)
    }catch(err){
      console.error(err)
      return responseBuilder.error(req,res,400,err)
    }
    return responseBuilder.success(res,200,data)
  }
}

module.exports = ProductController