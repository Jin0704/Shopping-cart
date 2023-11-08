
const yupCheck = require('../../helper/yupCheck')
class CategoryService{
  constructor(db){
    this.db = db
  }
  async getCategory(id){
    try{
      const data = await this.db.Category.findByPk(id)
      if(!data) throw new Error('Category not exists!')
      return data
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }
  async findAll(req){
    try{
      const perPage = req.query.perPage ? req.query.perPage : 6
      const offset = req.query.page ? (req.query.page - 1) * perPage : 0
      const categories = await this.db.Category.findAndCountAll({
        raw: true,
        nest: true,
        limit: perPage,
        offset:offset,
        attributes:['id','name','status']
      })
      return  categories
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }

  async findOne(id){
    try{
      const data = await this.getCategory(id)
      return data
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }
  async create(input){
    try{
      await yupCheck.categoryShape(input)
      await this.checkCategory(input.name)
      await this.db.Category.create(input)
      return true
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }
  async update(id,input){
    try{
      await yupCheck.categoryShape(input)
      const category = await this.getCategory(id)
      input.name = input.name === category.name ? input.name : await this.checkCategory(input.name)
      await category.update(input)
      return true
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }
  async delete(id){
    try{
      const category = await this.getCategory(id)
      // check 如果有產品綁定這個分類則不可刪除
      const isUsed = await this.checkCategoryIsUsed(id)
      if(isUsed) throw new Error('尚有產品使用此分類!')
      await category.destroy()
      return true
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }
  async editCategoryStatus(req){
    try{
      const category = await this.db.Category.findByPk(req.params.id)
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
  async checkCategory(name){
    try{
      const data = await this.db.Category.findOne({ where:{name}})
      if(data) throw new Error('Category have existed!')
      return name
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }
  // 確認該分類沒有綁定任何產品
  async checkCategoryIsUsed(id){
    try{
      const data = await this.db.Product.findAll({raw:true,nest:true, where:{ CategoryId:id }})
      return data.length > 0
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }
}


module.exports = CategoryService