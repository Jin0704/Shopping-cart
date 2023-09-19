const db = require('../models')

//Todo : Refactor
class ComputeHelper {
  static async compute(input){
    try{
      let amount = 0
      if(input.items.length){
        input.items.forEach(element => {
          amount += (element.price * element.CartItem.quantity)
        });
      }
      return amount
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }

  static async computePromotionCodeDiscount(promotionCode,amount){
    try{
      if(promotionCode.type=='fix'){
        return promotionCode.discount
      }else{
        return amount * promotionCode.discount / 100
      }
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }

}



module.exports = ComputeHelper