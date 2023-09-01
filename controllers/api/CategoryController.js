const CategoryService = require('../../services/category')
const responseBuilder = require('../../helper/responseBuilder')
const redis = require('../../redis')

const categoryController = {
  getCategories: async(req,res)=>{
    let data
    try{
      result = await redis.getKey('api-categories')
      data = result ? result : await CategoryService.getCategoriesAPI(req);
    }catch(err){
      console.error(err)
      return responseBuilder.error(req,res,500,err)
    }
    return responseBuilder.success(res,200,data)
  },
}

module.exports = categoryController