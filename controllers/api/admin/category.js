const responseBuilder = require('../../../helper/responseBuilder')
const CategoryService = require('../../../services/admin/category')

const CategoryController = {
  getCategories: async(req,res)=>{
    let data;
    try{
      data = await CategoryService.getCategories(req)
    }catch(err){
      console.error(err)
      return responseBuilder.error(req,res,500,err)
    }
    return responseBuilder.success(res,200,data)
  },
  getCategory: async(req,res)=>{
    let data;
    try{
      data = await CategoryService.getCategory(req.params.id)
    }catch(err){
      console.error(err)
      return responseBuilder.error(req,res,500,err)
    }
    return responseBuilder.success(res,200,data)
  },
  createCategory: async(req,res)=>{
    let data;
    try{
      data = await CategoryService.createCategory(req.body)
    }catch(err){
      console.error(err)
      return responseBuilder.error(req,res,500,err)
    }
    return responseBuilder.success(res,200,data)
  },
  editCategory: async(req,res)=>{
    let data;
    try{
      data = await CategoryService.editCategory(req)
    }catch(err){
      console.error(err)
      return responseBuilder.error(req,res,500,err)
    }
    return responseBuilder.success(res,200,data)
  },
  deleteCategory: async(req,res)=>{
    let data;
    try{
      data = await CategoryService.deleteCategory(req.params.id)
    }catch(err){
      console.error(err)
      return responseBuilder.error(req,res,500,err)
    }
    return responseBuilder.success(res,200,data)
  },
  editCategoryStatus: async(req,res)=>{
    let data;
    try{
      data = await CategoryService.editCategoryStatus(req)
    }catch(err){
      console.error(err)
      return responseBuilder.error(req,res,500,err)
    }
    return responseBuilder.success(res,200,data)
  }
}

module.exports = CategoryController