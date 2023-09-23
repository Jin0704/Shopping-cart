const yupCheck = require('../../helper/yupCheck')
const CategoryService = require('../../services/admin/category')
const redis = require('../../redis')

const CategoryController = {
  getCategories: async(req,res)=>{
    try {
      // check redis => Todo: 將跟redis驗證這個動作都丟到一個service中供不同的controller使用
      const redisResponse = await redis.getKey('admin-categories')
      if(redisResponse) return res.render('admin/categories', {...redisResponse})
      
      const { categories , pagination } =  await CategoryService.findAll(req)
      await redis.setKey('admin-categories',JSON.stringify({ categories, ...pagination }))
      return res.render('admin/categories', { categories, ...pagination })
    } catch (err) {
      console.log(err)
      return res.render('error',{err})
    }
  },

  getCategory: async(req,res)=>{
    try {
      const category = await CategoryService.findOne(req.params.id)
      return res.render('admin/category', { category: category.toJSON() })
    } catch (err) {
      console.log(err)
      return res.render('error',{err})
    }
  },

  createCategory: async (req, res) => {
    await redis.clearKey('admin-categories')
    return res.render('admin/createCategory')
  },

  postCategory: async(req,res)=>{
    try {
      await yupCheck.categoryShape(req.body)
      await CategoryService.create(req.body)
      await redis.clearKey('admin-categories')
      req.flash('success_messages', '新增成功')
      return res.redirect('/admin/categories')
    } catch (err) {
      console.log(err)
      return res.render('error',{err})
    }
  },

  editCategory: async (req, res) => {
    try {
      await yupCheck.categoryShape(req.body)
      await CategoryService.update(req.params.id,req.body)
      await redis.clearKey('admin-categories')
      req.flash('success_messages', '更新成功')
      return res.redirect('/admin/categories')
    } catch (err) {
      console.log(err)
      return res.render('error',{err})
    }
  },

  deleteCategory: async (req, res) => {
    try {
      await CategoryService.delete(req.params.id)
      await redis.clearKey('admin-categories')
      req.flash('success_messages', '刪除成功')
      return res.redirect('/admin/categories')
    } catch (err) {
      console.log(err)
      return res.render('error',{err:'刪除錯誤'})
    }
  },  
}

module.exports = CategoryController