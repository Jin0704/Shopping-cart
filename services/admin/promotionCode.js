const db = require('../../models')
const PromotionCode = db.PromotionCode


class PromotionCodeService{
  static async findAll(){
    try{
      const data = await PromotionCode.findAll({raw:true,nest:true})
      return data
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }
  
  static async findOne(id){
    try{
      let data = await PromotionCode.findByPk(id)
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

  static async create(input){
    try{
      await this.checkCode(input)
      await PromotionCode.create(input)
      return true
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }

  static async update(id,input){
    try{
      const promotionCode = await PromotionCode.findByPk(id)
      if(!promotionCode) throw new Error('PromotionCode not existed!')
      input.code = input.code === promotionCode.code ? input.code : await this.checkCode(input)
      await promotionCode.update(input)
      return true
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }

  static async checkCode(input){
    try{
      const promotionCode = await PromotionCode.findOne({
        where: { code: input.code } 
      })
      if(promotionCode) throw new Error('Code exists!')
      return true
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }
}


module.exports = PromotionCodeService