class PromotionCodeService{
  constructor(db){
    this.db = db
  }
  async findAll(){
    try{
      const data = await this.db.PromotionCode.findAll({raw:true,nest:true})
      return data
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }
  
  async findOne(id){
    try{
      let data = await this.db.PromotionCode.findByPk(id)
      data = data ? data.toJSON() : null
      if(data){
        data.validDate = data.validDate.toISOString().split('T')[0]
      }
      return data
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }

  async create(input){
    try{
      await this.checkCode(input.code)
      await this.db.PromotionCode.create(input)
      return true
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }

  async update(id,input){
    try{
      const promotionCode = await this.db.PromotionCode.findByPk(id)
      if(!promotionCode) throw new Error('PromotionCode not existed!')
      input.code = input.code === promotionCode.code ? input.code : await this.checkCode(input.code)
      await promotionCode.update(input)
      return true
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }

  async delete(id){
    try {
      const promotionCode = await this.db.PromotionCode.findByPk(id)
      await promotionCode.destroy()
      return true
    } catch (err) {
      console.log(err)
      return res.render('error',{err})
    }
  }

  async checkCode(code){
    try{
      const promotionCode = await this.db.PromotionCode.findOne({ where: { code }})
      if(promotionCode) throw new Error('Code exists!')
      return code
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }
}


module.exports = PromotionCodeService