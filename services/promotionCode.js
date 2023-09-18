const db = require('../models')
const PromotionCode = db.PromotionCode
const _ = require('lodash')

class PromotionCodeService {

  static async findOne(code){
    try{
      let data = await PromotionCode.findOne({
        where:{ code, status:true },
        attributes:['code','count','discount','status','type','usageLimited','validDate','usage']
      })
      data = data ? await this.isValid(data.toJSON()) : false
      return  _.pick(data,['code','discount','type'])
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }

  static async isValid(promotionCode){
    try{
      switch (promotionCode.usage){
        case "unlimited":
          return promotionCode
        case "usageLimited":
          return promotionCode.count+1 > promotionCode.usageLimited ? false : promotionCode
        case "date":
          return promotionCode.validDate > new Date() ? promotionCode : false
        default:
          return false
      }
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }

}

module.exports = PromotionCodeService