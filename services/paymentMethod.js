const db = require('../models')
const PaymentMethod = db.PaymentMethod

class PaymentMethodService{
  static async findAll(){
    try{
      const paymentMethods = await PaymentMethod.findAll({
        raw:true,
        where:{status:1}
      }) 
      return paymentMethods;
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }
}

module.exports = PaymentMethodService