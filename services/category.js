const sequelize = require('sequelize')
const db = require('../models')
const Category = db.Category

const CategoryService = {
  getCategories: async(req)=>{
    try{
      const data = await Category.findAll({ 
        raw:true,
        attributes:['id','name']
      })
      return {data}
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  },
  getCategory:{

  },
  createCategory:{

  },
  editCategory:{

  },
  deleteCategory:{

  }
}

module.exports = CategoryService

