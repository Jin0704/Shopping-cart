const CommonService = require('../../services/common')

class CategoryController {
  constructor(categoryService){
    this.categoryService = categoryService
  }
  
  findAll = async(req,res)=>{
    try{
      const categories = await this.categoryService.findAll(req)
      const pagination = await CommonService.calculatePagination({},categories.count,req.query.page)
      return res.render('admin/categories', { categories:categories.rows, ...pagination })
    }catch(err){
      console.error(err)
      return res.status(500).render('error',{err})
    }
  }

  findOne = async(req,res)=>{
    try{
      const category = await this.categoryService.findOne(req.params.id)
      return res.render('admin/category', {category: category.toJSON()})
    }catch(err){
      console.error(err)
      return res.status(500).render('error',{err})
    }
  }

  create = async(req,res)=>{
    try{
      return res.render('admin/createCategory')
    }catch(err){
      console.error(err)
      return res.status(500).render('error',{err})
    }
  }

  store = async(req,res)=>{
    try{
      await this.categoryService.create(req.body)
      req.flash('success_messages', '新增成功')
      return res.redirect('/admin/categories')
    }catch(err){
      console.error(err)
      return res.status(500).render('error',{err})
    }    
  }

  edit = async(req,res)=>{
    try{
      await this.categoryService.update(req.params.id,req.body)
      req.flash('success_messages', '更新成功')
      return res.redirect('/admin/categories')
    }catch(err){
      console.error(err)
      return res.status(500).render('error',{err})
    }    
  }

  delete = async(req,res)=>{
    try {
      await this.categoryService.delete(req.params.id)
      req.flash('success_messages', '刪除成功')
      return res.redirect('/admin/categories')
    } catch (err) {
      console.log(err)
      return res.status(500).render('error',{err})
    }
  }

}

module.exports = CategoryController