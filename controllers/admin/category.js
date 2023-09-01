const db = require('../../models')
const Category = db.Category
const yupCheck = require('../../helper/yupCheck')
const redis = require('../../redis')

const CategoryController = {
  getCategories: async(req,res)=>{
    try {
      let data;
      data = await redis.getKey('admin-categories')
      if(data){
        return res.render('admin/categories', {
          ...data
        })
      }
      let PAGE_OFFSET = 0
      const categoryPagelimit = 10
      if (req.query.page) {
        PAGE_OFFSET = (req.query.page - 1) * categoryPagelimit
      }

      const categories = await Category.findAndCountAll({
        raw: true,
        nest: true,
        limit: categoryPagelimit,
        offset: PAGE_OFFSET,
        attributes:['id','name','status']
      })
      // others
        const page = Number(req.query.page) || 1
        const pages = Math.ceil(categories.count / categoryPagelimit)
        const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
        const prev = page - 1 < 1 ? 1 : page - 1
        const next = page + 1 > pages ? pages : page + 1

      data = {
        categories: categories.rows,
        page: page,
        totalPage: totalPage,
        prev: prev,
        next: next
      }
      await redis.setKey('admin-categories',JSON.stringify(data))
      return res.render('admin/categories', {
        ...data
      })
    } catch (err) {
      console.log(err)
      return res.render('error',{err})
    }
  },

  getCategory: async(req,res)=>{
    try {
      const category = await Category.findByPk(req.params.id)
      return res.render('admin/category', { category: category.toJSON(), })
    } catch (error) {
      console.log(error)
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
      await Category.create({
        name: req.body.name,
        status: req.body.status
      })
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
      const category = await Category.findByPk(req.params.id)
      await yupCheck.categoryShape(req.body)
      await category.update({
        name: req.body.name,
        status: req.body.status
      })
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
      const category = await Category.findByPk(req.params.id)
      await category.destroy()
      await redis.clearKey('admin-categories')
      req.flash('success_messages', '刪除成功')
      return res.redirect('/admin/categories')
    } catch (err) {
      console.log(err)
      return res.render('error',{err})
    }
  },  
}

module.exports = CategoryController