const db = require('../../models')
const Category = db.Category
const CommonService = require('../../services/common')
class CategoryService{
  static async getCategory(id){
    try{
      const data = await Category.findByPk(id)
      if(!data) throw new Error('Category not exists!')
      return data
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }
  static async findAll(req){
    try{
      const perPage = req.query.perPage ? req.query.perPage : 10
      const offset = req.query.page ? (req.query.page - 1) * perPage : 0
      const categories = await Category.findAndCountAll({
        raw: true,
        nest: true,
        limit: perPage,
        offset:offset,
        attributes:['id','name','status']
      })
      const pagination = await CommonService.calculatePagination({},categories.count,req.query.page)
      return  { categories: categories.rows , pagination }
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }
  static async findOne(id){
    try{
      const data = await this.getCategory(id)
      return data
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }
  static async create(input){
    try{
      await this.checkCategory(input.name)
      await Category.create(input)
      return true
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }
  static async update(id,input){
    try{
      const category = await this.getCategory(id)
      input.name = input.name === category.name ? input.name : await this.checkCategory(input.name)
      await category.update(input)
      return true
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }
  static async delete(id){
    try{
      const category = await this.getCategory(id)
      await category.destroy()
      return true
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }
  static async editCategoryStatus(req){
    try{
      const category = await Category.findByPk(req.params.id)
      if(!category){
        throw new Error('Category not exists!')
      }
      await category.update({
        status: req.body.status
      })
      return { 'messages': '更新成功!'}
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }
  static async checkCategory(name){
    try{
      const data = await Category.findOne({ where:{name}})
      if(data) throw new Error('Category have existed!')
      return name
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }
}


module.exports = CategoryService