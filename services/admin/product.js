const yupCheck = require('../../helper/yupCheck')

class ProductService {
  constructor(db){
    this.db = db
    this.Category = db.Category
  }

  async findAll(req){
    try{
      const PAGE_LIMIT = req.query.perPage ? req.query.perPage : 6
      const PAGE_OFFSET = req.query.page ? (req.query.page-1) * PAGE_LIMIT : 0
      
      const products = await this.db.Product.findAndCountAll({
        raw: true,
        nest: true,
        limit: PAGE_LIMIT,
        offset: PAGE_OFFSET,
        include: [this.Category]
      })
      return products
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }

  async findOne(id){
    try{
      const product = this.db.Product.findByPk(id,
        {  include: [this.Category]}
      )
      if(!product) throw new Error('product not exists!')
      return product
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }

  async store(input){
    try{
      await yupCheck.productShape(input)
      await this.db.Product.create({...input})
      return true
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }

  async update(id,input){
    try{
      const product = await this.findOne(id)
      await yupCheck.productShape(input)
      input.image = input.image ? input.image : product.image
      await product.update({...input})
      return true
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }

  async delete(id){
    try{ 
      const product = await this.findOne(id)
      await product.destroy()
      return true
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }

  async getCategories(req){
    try{
      const perPage = req.query.perPage ? req.query.perPage : 6
      const offset = req.query.page ? (req.query.page - 1) * perPage : 0
      const categories = await this.Category.findAndCountAll({
        raw: true,
        nest: true,
        limit: perPage,
        offset:offset,
        attributes:['id','name','status']
      })

      return  categories.rows
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }
}


module.exports = ProductService