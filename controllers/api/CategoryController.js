const CategoryService = require('../../services/category')
const responseBuilder = require('../../helper/responseBuilder')

const categoryController = {
  getCategories: async(req,res)=>{
    let data
    try{
      data = await CategoryService.getCategories(req);
    }catch(err){
      console.error(err)
      return responseBuilder.error(req,res,500,err)
    }
    return responseBuilder.success(res,200,data)
  },
}

module.exports = categoryController