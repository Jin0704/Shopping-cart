const db = require('../../models')
const Category = db.Category

const CategoryService = {
  getCategories: async(req)=>{
    try{
      let offset = 0
      const perPage = req.query.perPage ? req.query.perPage : 10
      if (req.query.page) {
        offset = (req.query.page - 1) * perPage
      }
      const categories = await Category.findAndCountAll({
        raw: true,
        nest: true,
        limit: perPage,
        offset:offset,
        attributes:['id','name','status']
      })
      const page = Number(req.query.page) || 1
      const pages = Math.ceil(categories.count / perPage)
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1

      return  {
        categories: categories.rows,
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
  getCategory: async(id)=>{
    try{
      const data = await Category.findByPk(id)
      if(!data){
        throw new Error('Category not exists!')
      }
      return { data }
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  },
  createCategory: async(input)=>{
    try{
      const category = await Category.findOne({
         where: { name: input.name } 
      })
      if(category) throw new Error('Category have existed!')
      await Category.create({
        name: input.name,
        status: input.status
      })
      return {'messages':'新增成功!'}
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  },
  editCategory: async(req)=>{
    try{
      const category = await Category.findByPk(req.params.id)
      if(!category) throw new Error('Category not exists!')
      await category.update({
        name: req.body.name,
        status: req.body.status
      })
      return { 'messages':'更新成功'} 
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  },
  deleteCategory: async(id)=>{
    try{
      const category = await Category.findByPk(id)
      if(!category){
        throw new Error('Category not exists!')
      }
      await category.destroy()
      return { 'messages': '刪除成功!'}
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  },
  editCategoryStatus: async(req)=>{
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
}


module.exports = CategoryService